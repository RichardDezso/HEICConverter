import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'test_database';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getGuides() {
  const { db } = await connectToDatabase();
  const guides = await db.collection('blog_posts')
    .find({}, { projection: { _id: 0 } })
    .toArray();
  return guides;
}

export async function getGuideBySlug(slug) {
  const { db } = await connectToDatabase();
  const guide = await db.collection('blog_posts')
    .findOne({ id: slug }, { projection: { _id: 0 } });
  return guide;
}
