from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import FileResponse, Response, StreamingResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import tempfile
import shutil
from PIL import Image
import pillow_heif
import img2pdf
import zipfile
import io
import secrets
from passlib.hash import bcrypt

# Register HEIF opener with Pillow
pillow_heif.register_heif_opener()

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


def convert_heic_to_format(input_path: str, output_format: str) -> bytes:
    """
    Convert HEIC file to specified format and return bytes.
    """
    # Open HEIC image
    img = Image.open(input_path)
    
    # Convert RGBA to RGB if necessary (for JPEG)
    if img.mode in ('RGBA', 'LA') and output_format in ['jpeg', 'jpg']:
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
    
    # Generate output
    output_extension = 'jpg' if output_format == 'jpeg' else output_format
    
    if output_format == 'pdf':
        # Convert to PDF using img2pdf
        # First save as PNG temporarily
        temp_png_fd, temp_png_path = tempfile.mkstemp(suffix='.png')
        os.close(temp_png_fd)
        
        try:
            if img.mode in ('RGBA', 'LA'):
                img_rgb = Image.new('RGB', img.size, (255, 255, 255))
                img_rgb.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img_rgb.save(temp_png_path, 'PNG')
            else:
                img.save(temp_png_path, 'PNG')
            
            # Convert PNG to PDF
            pdf_bytes = img2pdf.convert(temp_png_path)
            return pdf_bytes
        finally:
            # Clean up temporary PNG
            if os.path.exists(temp_png_path):
                os.unlink(temp_png_path)
            img.close()
    else:
        # Save as JPEG or PNG to bytes
        output_buffer = io.BytesIO()
        img.save(output_buffer, output_format.upper())
        img.close()
        return output_buffer.getvalue()


@api_router.options("/convert")
async def convert_options():
    """Handle CORS preflight requests"""
    return {"detail": "OK"}

@api_router.post("/convert")
async def convert_heic(
    file: UploadFile = File(...),
    output_format: str = Form("jpeg")
):
    """
    Convert HEIC file to JPEG, PNG, or PDF format.
    Automatically deletes the uploaded file after conversion.
    """
    # Validate output format
    valid_formats = ["jpeg", "jpg", "png", "pdf"]
    output_format = output_format.lower()
    
    if output_format not in valid_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid output format. Supported formats: {', '.join(valid_formats)}"
        )
    
    # Validate file extension
    if not file.filename.lower().endswith(('.heic', '.heif')):
        raise HTTPException(
            status_code=400,
            detail="File must be in HEIC or HEIF format"
        )
    
    temp_input_path = None
    
    try:
        # Create temporary file for input HEIC
        with tempfile.NamedTemporaryFile(delete=False, suffix='.heic') as temp_input:
            temp_input_path = temp_input.name
            # Write uploaded file to temp location
            content = await file.read()
            temp_input.write(content)
        
        # Convert the file
        file_content = convert_heic_to_format(temp_input_path, output_format)
        
        # Delete the input file (as per requirement)
        if temp_input_path and os.path.exists(temp_input_path):
            os.unlink(temp_input_path)
            temp_input_path = None
        
        # Generate output filename
        base_filename = Path(file.filename).stem
        output_extension = 'jpg' if output_format == 'jpeg' else output_format
        output_filename = f"{base_filename}.{output_extension}"
        
        # Return the converted file
        return Response(
            content=file_content,
            media_type=f"image/{output_extension}" if output_format != 'pdf' else "application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={output_filename}"
            }
        )
    
    except Exception as e:
        # Clean up temporary files in case of error
        if temp_input_path and os.path.exists(temp_input_path):
            os.unlink(temp_input_path)
        
        logger.error(f"Error converting file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error converting file: {str(e)}"
        )


@api_router.post("/convert-batch")
async def convert_heic_batch(
    files: List[UploadFile] = File(...),
    output_format: str = Form("jpeg")
):
    """
    Convert multiple HEIC files to JPEG, PNG, or PDF format.
    Returns a ZIP file containing all converted files.
    """
    # Validate output format
    valid_formats = ["jpeg", "jpg", "png", "pdf"]
    output_format = output_format.lower()
    
    if output_format not in valid_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid output format. Supported formats: {', '.join(valid_formats)}"
        )
    
    if not files or len(files) == 0:
        raise HTTPException(
            status_code=400,
            detail="No files provided"
        )
    
    temp_input_paths = []
    converted_files = []
    
    try:
        # Process each file
        for file in files:
            # Validate file extension
            if not file.filename.lower().endswith(('.heic', '.heif')):
                logger.warning(f"Skipping non-HEIC file: {file.filename}")
                continue
            
            # Create temporary file for input HEIC
            with tempfile.NamedTemporaryFile(delete=False, suffix='.heic') as temp_input:
                temp_input_path = temp_input.name
                temp_input_paths.append(temp_input_path)
                
                # Write uploaded file to temp location
                content = await file.read()
                temp_input.write(content)
            
            # Convert the file
            file_content = convert_heic_to_format(temp_input_path, output_format)
            
            # Generate output filename
            base_filename = Path(file.filename).stem
            output_extension = 'jpg' if output_format == 'jpeg' else output_format
            output_filename = f"{base_filename}.{output_extension}"
            
            converted_files.append((output_filename, file_content))
        
        if not converted_files:
            raise HTTPException(
                status_code=400,
                detail="No valid HEIC files found"
            )
        
        # Create ZIP file in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for filename, content in converted_files:
                zip_file.writestr(filename, content)
        
        zip_buffer.seek(0)
        
        # Clean up temporary input files
        for temp_path in temp_input_paths:
            if os.path.exists(temp_path):
                os.unlink(temp_path)
        
        # Return the ZIP file
        return StreamingResponse(
            io.BytesIO(zip_buffer.getvalue()),
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename=converted_files.zip"
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        # Clean up temporary files in case of error
        for temp_path in temp_input_paths:
            if os.path.exists(temp_path):
                os.unlink(temp_path)
        
        logger.error(f"Error converting batch files: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error converting files: {str(e)}"
        )


# Admin endpoints
security = HTTPBasic()

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    password_file = ROOT_DIR / '.admin_password'
    stored_password_hash = password_file.read_text().strip()
    
    # Check if password is hashed (starts with $2b$ for bcrypt)
    if stored_password_hash.startswith('$2b$'):
        # Verify hashed password
        is_correct = bcrypt.verify(credentials.password, stored_password_hash)
    else:
        # Fallback to plain text comparison (for backward compatibility)
        is_correct = secrets.compare_digest(
            credentials.password.encode("utf8"),
            stored_password_hash.encode("utf8")
        )
    
    if not is_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return True

@api_router.post("/admin/login")
async def admin_login(credentials: HTTPBasicCredentials = Depends(security)):
    verify_admin(credentials)
    return {"message": "Login successful"}

@api_router.get("/admin/posts")
async def get_all_posts(authorized: bool = Depends(verify_admin)):
    posts = await db.blog_posts.find({}, {"_id": 0}).to_list(1000)
    return posts

@api_router.get("/admin/posts/{post_id}")
async def get_post(post_id: str, authorized: bool = Depends(verify_admin)):
    post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@api_router.post("/admin/posts")
async def create_post(post: dict, authorized: bool = Depends(verify_admin)):
    # Check if post with this ID already exists
    existing = await db.blog_posts.find_one({"id": post["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Post with this ID already exists")
    
    await db.blog_posts.insert_one(post)
    # Return the post without MongoDB's _id field
    created_post = await db.blog_posts.find_one({"id": post["id"]}, {"_id": 0})
    return {"message": "Post created successfully", "post": created_post}

@api_router.put("/admin/posts/{post_id}")
async def update_post(post_id: str, post: dict, authorized: bool = Depends(verify_admin)):
    result = await db.blog_posts.replace_one({"id": post_id}, post)
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    # Return the updated post without MongoDB's _id field
    updated_post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    return {"message": "Post updated successfully", "post": updated_post}

@api_router.delete("/admin/posts/{post_id}")
async def delete_post(post_id: str, authorized: bool = Depends(verify_admin)):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted successfully"}

# Public blog endpoints (no auth required)
@api_router.get("/blog/posts")
async def get_blog_posts():
    posts = await db.blog_posts.find({}, {"_id": 0}).to_list(1000)
    # Return response with no-cache headers
    return Response(
        content=json.dumps(posts, default=str),
        media_type="application/json",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

@api_router.get("/blog/posts/{post_id}")
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# SEO endpoints
@api_router.get("/sitemap.xml")
async def get_sitemap():
    """Generate dynamic sitemap with all pages"""
    from datetime import datetime
    
    # Get frontend URL from environment
    frontend_url = os.environ.get('FRONTEND_URL', 'https://heicconverter.online')
    
    # Get all blog posts
    posts = await db.blog_posts.find({}, {"_id": 0, "id": 1, "date": 1}).to_list(1000)
    
    # Static pages
    static_pages = [
        {"loc": "/", "priority": "1.0"},
        {"loc": "/about", "priority": "0.8"},
        {"loc": "/contact", "priority": "0.8"},
        {"loc": "/privacy", "priority": "0.5"},
        {"loc": "/blog", "priority": "0.9"},
    ]
    
    # Keyword pages
    keyword_pages = [
        {"loc": "/heic-to-jpg", "priority": "0.9"},
        {"loc": "/heic-to-png", "priority": "0.9"},
        {"loc": "/heic-to-pdf", "priority": "0.9"},
    ]
    
    # Build XML
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Add static pages
    for page in static_pages:
        xml += '  <url>\n'
        xml += f'    <loc>{frontend_url}{page["loc"]}</loc>\n'
        xml += f'    <changefreq>weekly</changefreq>\n'
        xml += f'    <priority>{page["priority"]}</priority>\n'
        xml += '  </url>\n'
    
    # Add keyword pages
    for page in keyword_pages:
        xml += '  <url>\n'
        xml += f'    <loc>{frontend_url}{page["loc"]}</loc>\n'
        xml += f'    <changefreq>monthly</changefreq>\n'
        xml += f'    <priority>{page["priority"]}</priority>\n'
        xml += '  </url>\n'
    
    # Add blog posts
    for post in posts:
        xml += '  <url>\n'
        xml += f'    <loc>{frontend_url}/blog/{post["id"]}</loc>\n'
        xml += f'    <lastmod>{post.get("date", datetime.now().strftime("%Y-%m-%d"))}</lastmod>\n'
        xml += f'    <changefreq>monthly</changefreq>\n'
        xml += f'    <priority>0.7</priority>\n'
        xml += '  </url>\n'
    
    xml += '</urlset>'
    
    return Response(content=xml, media_type="application/xml")

@api_router.get("/robots.txt")
async def get_robots():
    """Generate robots.txt file"""
    # Get frontend URL from environment
    frontend_url = os.environ.get('FRONTEND_URL', 'https://heicconverter.online')
    
    robots = f"""User-agent: *
Allow: /

Sitemap: {frontend_url}/api/sitemap.xml

# Disallow admin routes
Disallow: /admin
Disallow: /admin/*
"""
    return Response(content=robots, media_type="text/plain")

# Image upload endpoint
@api_router.post("/admin/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    authorized: bool = Depends(verify_admin)
):
    """Upload an image for blog posts"""
    import hashlib
    from datetime import datetime
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only images allowed.")
    
    # Create uploads directory if it doesn't exist
    uploads_dir = ROOT_DIR / 'uploads'
    uploads_dir.mkdir(exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    file_extension = Path(file.filename).suffix
    
    # Create a hash of the file content for uniqueness
    file_content = await file.read()
    file_hash = hashlib.md5(file_content).hexdigest()[:8]
    
    filename = f"{timestamp}_{file_hash}{file_extension}"
    file_path = uploads_dir / filename
    
    # Save file
    with open(file_path, 'wb') as f:
        f.write(file_content)
    
    # Return the URL
    frontend_url = os.environ.get('FRONTEND_URL', 'https://heicconverter.online')
    image_url = f"{frontend_url}/api/uploads/{filename}"
    
    return {
        "success": True,
        "url": image_url,
        "filename": filename
    }

# Serve uploaded images
@api_router.get("/uploads/{filename}")
async def serve_uploaded_image(filename: str):
    """Serve uploaded images"""
    file_path = ROOT_DIR / 'uploads' / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(file_path)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()