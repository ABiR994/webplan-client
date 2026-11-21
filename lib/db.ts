import { attachDatabasePool } from "@vercel/functions"
import { MongoClient } from "mongodb"

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient }

if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = new MongoClient(
    process.env.MONGODB_URI as string,
    { maxIdleTimeMS: 5000, serverSelectionTimeoutMS: 10000 }
  )
  attachDatabasePool(globalForMongo.mongoClient)
}

export const client = globalForMongo.mongoClient
export const db = client.db("wedplandb")
