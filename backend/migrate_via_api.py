#!/usr/bin/env python3
"""
Blog Posts Migration via API
Exports from local DB and imports via production API
This is easier as you don't need production DB credentials
"""
import asyncio
import json
import os
import requests
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import getpass

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Local MongoDB connection
LOCAL_MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
LOCAL_DB_NAME = os.environ.get('DB_NAME', 'test_database')

# Production API URL
PRODUCTION_URL = "https://heicconverteronline.com"

async def export_posts():
    """Export blog posts from local database"""
    print("=" * 60)
    print("Exporting Blog Posts from Local Database")
    print("=" * 60)
    
    client = AsyncIOMotorClient(LOCAL_MONGO_URL)
    db = client[LOCAL_DB_NAME]
    
    # Get all blog posts
    posts = await db.blog_posts.find({}, {"_id": 0}).to_list(1000)
    
    print(f"\n✓ Found {len(posts)} blog posts")
    
    if len(posts) == 0:
        print("❌ No posts to export!")
        client.close()
        return []
    
    # Show posts
    print("\nPosts found:")
    for i, post in enumerate(posts, 1):
        print(f"  {i}. {post.get('title', 'No title')}")
    
    client.close()
    return posts

def import_posts_via_api(posts, admin_password):
    """Import posts via production API"""
    print("\n" + "=" * 60)
    print("Importing to Production via API")
    print("=" * 60)
    
    # Test authentication
    print(f"\n🔐 Testing admin login...")
    auth = ('admin', admin_password)
    
    response = requests.post(f"{PRODUCTION_URL}/api/admin/login", auth=auth)
    
    if response.status_code != 200:
        print(f"❌ Login failed! Status: {response.status_code}")
        print(f"   Make sure password '{admin_password}' is correct")
        return False
    
    print("✓ Login successful!")
    
    # Check existing posts
    print(f"\n📊 Checking existing posts...")
    response = requests.get(f"{PRODUCTION_URL}/api/admin/posts", auth=auth)
    existing_posts = response.json() if response.status_code == 200 else []
    print(f"   Found {len(existing_posts)} existing posts")
    
    if len(existing_posts) > 0:
        choice = input(f"\n⚠️  Delete {len(existing_posts)} existing posts first? (yes/no): ")
        if choice.lower() == 'yes':
            for post in existing_posts:
                post_id = post.get('id')
                print(f"   Deleting: {post.get('title')}...")
                requests.delete(f"{PRODUCTION_URL}/api/admin/posts/{post_id}", auth=auth)
            print("✓ Existing posts deleted")
    
    # Import new posts
    print(f"\n📤 Uploading {len(posts)} posts...")
    success_count = 0
    
    for i, post in enumerate(posts, 1):
        title = post.get('title', 'Untitled')
        post_id = post.get('id', f'post-{i}')
        
        print(f"   [{i}/{len(posts)}] Uploading: {title}...")
        
        # Prepare post data
        post_data = {
            'id': post_id,
            'title': post.get('title', ''),
            'excerpt': post.get('excerpt', ''),
            'date': post.get('date', ''),
            'image': post.get('image', ''),
            'imageAlt': post.get('imageAlt', ''),
            'keywords': post.get('keywords', ''),
            'content': post.get('content', []),
            'contentType': 'json'  # Mark as JSON content
        }
        
        response = requests.post(
            f"{PRODUCTION_URL}/api/admin/posts",
            auth=auth,
            json=post_data
        )
        
        if response.status_code in [200, 201]:
            print(f"      ✓ Success")
            success_count += 1
        else:
            print(f"      ❌ Failed: {response.status_code}")
            print(f"         {response.text}")
    
    print(f"\n✅ Migration complete: {success_count}/{len(posts)} posts uploaded")
    return True

async def main():
    print("\n" + "=" * 60)
    print("Blog Migration Tool (API Method)")
    print("=" * 60)
    print("\nThis tool will:")
    print("1. Export posts from your local database")
    print("2. Upload them to production via the admin API")
    print("3. No database credentials needed!")
    
    # Step 1: Export
    posts = await export_posts()
    
    if not posts:
        print("\n❌ No posts to migrate")
        return
    
    # Step 2: Get admin password
    print("\n" + "=" * 60)
    print("Admin Authentication")
    print("=" * 60)
    
    admin_password = getpass.getpass("\nEnter admin password for production: ")
    
    # Step 3: Confirm
    print("\n" + "=" * 60)
    print("Ready to Import")
    print("=" * 60)
    print(f"\n📤 Posts to upload: {len(posts)}")
    print(f"📥 Destination: {PRODUCTION_URL}")
    
    response = input("\nProceed? (yes/no): ")
    
    if response.lower() != 'yes':
        print("\n❌ Migration cancelled")
        return
    
    # Step 4: Import
    success = import_posts_via_api(posts, admin_password)
    
    if success:
        print("\n" + "=" * 60)
        print("✅ Migration Complete!")
        print("=" * 60)
        print("\n✓ All posts uploaded successfully")
        print(f"\n🌐 View your blog: {PRODUCTION_URL}/blog")
        print(f"🔧 Manage posts: {PRODUCTION_URL}/admin")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n❌ Migration cancelled")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
