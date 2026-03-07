import { MongoClient, Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function getDb(): Promise<Db> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in environment variables")
  }

  if (cachedClient && cachedDb) {
    return cachedDb
  }

  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()

  const db = client.db("bookskart") // Default database name

  cachedClient = client
  cachedDb = db

  return db
}
