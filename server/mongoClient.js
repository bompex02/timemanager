import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGODB_CONNECTION_STRING;

if (!uri) {
  throw new Error('MongoDB connection string is not defined in .env file');
}

const client = new MongoClient(uri, {
  ssl: true,
  tlsAllowInvalidCertificates: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let isConnected = false;

// Connect to the MongoDB database and return the database instance
export const getDb = async () => {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    await client.db("timemanager").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    console.log('✅ MongoDB verbunden');
  }

  return client.db('timemanager');
};
