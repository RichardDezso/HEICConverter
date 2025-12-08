#!/usr/bin/env python3
"""
Blog Posts Migration Script
Exports blog posts from local database and imports to production
"""
import asyncio
import json
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Local MongoDB connection
LOCAL_MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
LOCAL_DB_NAME = os.environ.get('DB_NAME', 'test_database')

async def export_posts():
    """Export blog posts from local database to JSON file"""
    print("=" * 60)
    print("STEP 1: Exporting Blog Posts from Local Database")
    print("=" * 60)
    
    client = AsyncIOMotorClient(LOCAL_MONGO_URL)
    db = client[LOCAL_DB_NAME]
    
    # Get all blog posts
    posts = await db.blog_posts.find({}, {"_id": 0}).to_list(1000)
    
    print(f"\n✓ Found {len(posts)} blog posts in local database")
    
    if len(posts) == 0:
        print("❌ No posts to export!")
        client.close()
        return None
    
    # Show posts
    print("\nPosts to export:")
    for i, post in enumerate(posts, 1):
        print(f"  {i}. {post.get('title', 'No title')} (ID: {post.get('id', 'No ID')})")
    
    # Save to JSON file
    export_file = ROOT_DIR / 'blog_posts_export.json'
    with open(export_file, 'w') as f:
        json.dump(posts, f, indent=2, default=str)
    
    print(f"\n✅ Exported to: {export_file}")
    
    client.close()
    return export_file

async def import_posts(export_file, production_mongo_url, production_db_name):
    """Import blog posts from JSON file to production database"""
    print("\n" + "=" * 60)
    print("STEP 2: Importing Blog Posts to Production Database")
    print("=" * 60)
    
    # Read export file
    with open(export_file, 'r') as f:
        posts = json.load(f)
    
    print(f"\n✓ Loaded {len(posts)} posts from export file")
    
    # Connect to production database
    print(f"\nConnecting to production database...")
    print(f"  URL: {production_mongo_url[:30]}...")
    print(f"  Database: {production_db_name}")
    
    client = AsyncIOMotorClient(production_mongo_url)
    db = client[production_db_name]
    
    # Check if posts already exist
    existing_count = await db.blog_posts.count_documents({})
    print(f"\n  Current posts in production: {existing_count}")
    
    if existing_count > 0:
        response = input(f"\n⚠️  Production database already has {existing_count} posts. Overwrite? (yes/no): ")
        if response.lower() != 'yes':
            print("❌ Import cancelled")
            client.close()
            return
        
        # Clear existing posts
        await db.blog_posts.delete_many({})
        print("✓ Cleared existing posts")
    
    # Insert posts
    result = await db.blog_posts.insert_many(posts)
    print(f"\n✅ Successfully imported {len(result.inserted_ids)} blog posts!")
    
    # Verify
    final_count = await db.blog_posts.count_documents({})
    print(f"✓ Verified: {final_count} posts now in production database")
    
    print("\nImported posts:")
    for i, post in enumerate(posts, 1):
        print(f"  {i}. {post.get('title', 'No title')}")
    
    client.close()

async def main():
    print("\n" + "=" * 60)
    print("Blog Posts Migration Tool")
    print("=" * 60)
    
    # Step 1: Export from local
    export_file = await export_posts()
    
    if not export_file:
        return
    
    # Step 2: Get production database details
    print("\n" + "=" * 60)
    print("Production Database Configuration")
    print("=" * 60)
    
    print("\n📌 You need your production MongoDB connection details.")
    print("These can be found in Emergent's deployment settings.\n")
    
    # Option 1: Use environment variable if set
    prod_mongo_url = os.environ.get('PROD_MONGO_URL')
    prod_db_name = os.environ.get('PROD_DB_NAME')
    
    if not prod_mongo_url:
        print("Enter production MongoDB URL:")
        print("(Example: mongodb://username:password@host:port)")
        prod_mongo_url = input("> ").strip()
    
    if not prod_db_name:
        print("\nEnter production database name:")
        print(f"(Default: {LOCAL_DB_NAME})")
        prod_db_name = input("> ").strip() or LOCAL_DB_NAME
    
    # Confirm before proceeding
    print("\n" + "=" * 60)
    print("Ready to Import")
    print("=" * 60)
    print(f"\n📤 From: Local database ({LOCAL_DB_NAME})")
    print(f"📥 To: Production database ({prod_db_name})")
    print(f"📝 Posts: {len(json.load(open(export_file)))}")
    
    response = input("\nProceed with import? (yes/no): ")
    
    if response.lower() == 'yes':
        await import_posts(export_file, prod_mongo_url, prod_db_name)
        print("\n" + "=" * 60)
        print("✅ Migration Complete!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Visit: https://heicconverteronline.com/blog")
        print("2. Verify all posts are visible")
        print("3. Check formatting in each post")
    else:
        print("\n❌ Import cancelled")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n❌ Migration cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
