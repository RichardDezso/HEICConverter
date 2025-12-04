from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import tempfile
import shutil
from PIL import Image
import pillow_heif
import img2pdf

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
    temp_output_path = None
    
    try:
        # Create temporary file for input HEIC
        with tempfile.NamedTemporaryFile(delete=False, suffix='.heic') as temp_input:
            temp_input_path = temp_input.name
            # Write uploaded file to temp location
            content = await file.read()
            temp_input.write(content)
        
        # Open HEIC image
        img = Image.open(temp_input_path)
        
        # Convert RGBA to RGB if necessary (for JPEG)
        if img.mode in ('RGBA', 'LA') and output_format in ['jpeg', 'jpg']:
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Generate output filename
        base_filename = Path(file.filename).stem
        output_extension = 'jpg' if output_format == 'jpeg' else output_format
        output_filename = f"{base_filename}.{output_extension}"
        
        # Create temporary file for output
        temp_output_fd, temp_output_path = tempfile.mkstemp(suffix=f'.{output_extension}')
        os.close(temp_output_fd)
        
        if output_format == 'pdf':
            # Convert to PDF using img2pdf
            # First save as PNG temporarily
            temp_png_fd, temp_png_path = tempfile.mkstemp(suffix='.png')
            os.close(temp_png_fd)
            
            if img.mode in ('RGBA', 'LA'):
                img_rgb = Image.new('RGB', img.size, (255, 255, 255))
                img_rgb.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img_rgb.save(temp_png_path, 'PNG')
            else:
                img.save(temp_png_path, 'PNG')
            
            # Convert PNG to PDF
            with open(temp_output_path, 'wb') as f:
                f.write(img2pdf.convert(temp_png_path))
            
            # Clean up temporary PNG
            os.unlink(temp_png_path)
        else:
            # Save as JPEG or PNG
            img.save(temp_output_path, output_format.upper())
        
        img.close()
        
        # Delete the input file (as per requirement)
        if temp_input_path and os.path.exists(temp_input_path):
            os.unlink(temp_input_path)
            temp_input_path = None
        
        # Return the converted file
        return FileResponse(
            path=temp_output_path,
            media_type=f"image/{output_extension}" if output_format != 'pdf' else "application/pdf",
            filename=output_filename,
            background=None
        )
    
    except Exception as e:
        # Clean up temporary files in case of error
        if temp_input_path and os.path.exists(temp_input_path):
            os.unlink(temp_input_path)
        if temp_output_path and os.path.exists(temp_output_path):
            os.unlink(temp_output_path)
        
        logger.error(f"Error converting file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error converting file: {str(e)}"
        )


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