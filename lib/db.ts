import { MongoClient, Db } from "mongodb"

const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

export async function getDb(): Promise<Db> {
  // Use MONGODB_URI as primary, DATABASE_URL as fallback
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL

  if (!uri) {
    throw new Error('Database connection string is missing. Please add "MONGODB_URI" or "DATABASE_URL" to your Vercel Environment Variables.')
  }

  if (!clientPromise) {
    if (process.env.NODE_ENV === "development") {
      let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
      }

      if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
      }
      clientPromise = globalWithMongo._mongoClientPromise
    } else {
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
    }
  }

  const connectedClient = await clientPromise
  return connectedClient.db("bookskart")
}
