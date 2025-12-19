import { MongoClient } from 'mongodb';
import fallbackGuides from '@/data/guides-fallback.json';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'test_database';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 5000,
    });
    const db = client.db(DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.warn('MongoDB connection failed, using fallback data:', error.message);
    return null;
  }
}

export async function getGuides() {
  try {
    const connection = await connectToDatabase();
    if (!connection) {
      console.log('Using fallback guide data for getGuides()');
      return fallbackGuides;
    }
    
    const { db } = connection;
    const guides = await db.collection('blog_posts')
      .find({}, { projection: { _id: 0 } })
      .toArray();
    return guides.length > 0 ? guides : fallbackGuides;
  } catch (error) {
    console.warn('Error fetching guides from MongoDB:', error.message);
    return fallbackGuides;
  }
}

export async function getGuideBySlug(slug) {
  try {
    const connection = await connectToDatabase();
    if (!connection) {
      console.log('Using fallback guide data for getGuideBySlug()');
      return fallbackGuides.find(g => g.id === slug) || null;
    }
    
    const { db } = connection;
    const guide = await db.collection('blog_posts')
      .findOne({ id: slug }, { projection: { _id: 0 } });
    
    // If guide found in DB, return it; otherwise check fallback
    if (guide) return guide;
    
    // Try fallback data if not found in DB
    return fallbackGuides.find(g => g.id === slug) || null;
  } catch (error) {
    console.warn('Error fetching guide from MongoDB:', error.message);
    return fallbackGuides.find(g => g.id === slug) || null;
  }
}

export async function getGuideSlugs() {
  try {
    const connection = await connectToDatabase();
    if (!connection) {
      console.log('Using fallback guide slugs');
      return fallbackGuides.map(g => g.id);
    }
    
    const { db } = connection;
    const guides = await db.collection('blog_posts')
      .find({}, { projection: { _id: 0, id: 1 } })
      .toArray();
    return guides.length > 0 ? guides.map(g => g.id) : fallbackGuides.map(g => g.id);
  } catch (error) {
    console.warn('Error fetching guide slugs from MongoDB:', error.message);
    return fallbackGuides.map(g => g.id);
  }
}
