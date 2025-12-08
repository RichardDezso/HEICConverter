#!/usr/bin/env python3
"""Upload the 2 missing blog posts"""
import asyncio
import requests
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

LOCAL_MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
LOCAL_DB_NAME = os.environ.get('DB_NAME', 'test_database')
PRODUCTION_URL = "https://heicconverteronline.com"

async def get_missing_posts():
    """Get the 2 posts that weren't uploaded"""
    client = AsyncIOMotorClient(LOCAL_MONGO_URL)
    db = client[LOCAL_DB_NAME]
    
    # Get the 2 missing posts
    missing_ids = [
        'what-is-heic-file-complete-guide',
        'heic-vs-jpg-comparison'
    ]
    
    posts = []
    for post_id in missing_ids:
        post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
        if post:
            posts.append(post)
    
    client.close()
    return posts

def upload_posts(posts, password):
    """Upload posts via API"""
    auth = ('admin', password)
    
    print(f"Uploading {len(posts)} missing posts...\n")
    
    for i, post in enumerate(posts, 1):
        title = post.get('title')
        post_id = post.get('id')
        
        print(f"[{i}/{len(posts)}] Uploading: {title}...")
        
        post_data = {
            'id': post_id,
            'title': post.get('title', ''),
            'excerpt': post.get('excerpt', ''),
            'date': post.get('date', ''),
            'image': post.get('image', ''),
            'imageAlt': post.get('imageAlt', ''),
            'keywords': post.get('keywords', ''),
            'content': post.get('content', []),
            'contentType': 'json'
        }
        
        # Try multiple times with fresh auth
        for attempt in range(3):
            try:
                response = requests.post(
                    f"{PRODUCTION_URL}/api/admin/posts",
                    auth=auth,
                    json=post_data,
                    timeout=30
                )
                
                if response.status_code in [200, 201]:
                    print(f"   ✓ Success!\n")
                    break
                else:
                    print(f"   Attempt {attempt+1} failed: {response.status_code}")
                    if attempt == 2:
                        print(f"   ❌ Failed after 3 attempts\n")
            except Exception as e:
                print(f"   Attempt {attempt+1} error: {e}")
                if attempt == 2:
                    print(f"   ❌ Failed after 3 attempts\n")

async def main():
    print("=" * 60)
    print("Upload Missing Blog Posts")
    print("=" * 60)
    
    posts = await get_missing_posts()
    
    print(f"\nFound {len(posts)} missing posts:")
    for post in posts:
        print(f"  - {post.get('title')}")
    
    password = "SecureHeic2024!"
    
    print(f"\nUsing password: {password}")
    print("\nStarting upload...\n")
    
    upload_posts(posts, password)
    
    print("=" * 60)
    print("Verifying results...")
    print("=" * 60)
    
    # Check production
    response = requests.get(f"{PRODUCTION_URL}/api/blog/posts")
    if response.status_code == 200:
        prod_posts = response.json()
        print(f"\n✓ Production now has {len(prod_posts)} posts:")
        for i, post in enumerate(prod_posts, 1):
            print(f"  {i}. {post.get('title')}")
    
    print(f"\n🌐 View blog: {PRODUCTION_URL}/blog")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
