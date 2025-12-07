import asyncio
import json
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def migrate_blog_posts():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Read blog posts from JSON file
    json_file = ROOT_DIR.parent / 'frontend' / 'src' / 'data' / 'blogPosts.json'
    
    with open(json_file, 'r') as f:
        posts = json.load(f)
    
    # Clear existing posts
    await db.blog_posts.delete_many({})
    
    # Insert posts
    if posts:
        await db.blog_posts.insert_many(posts)
        print(f"✅ Migrated {len(posts)} blog posts to MongoDB")
    else:
        print("No posts found to migrate")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate_blog_posts())
