import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from '../config/env.js';

const client = new MongoClient(config.mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let isConnected = false;

export const getDb = async () => {
  if (!isConnected) {
    await client.connect();
    await client.db('chroniq').command({ ping: 1 });
    isConnected = true;
    console.log('✅ MongoDB verbunden');
  }

  return client.db('chroniq');
};

export const closeDb = async () => {
  if (isConnected) {
    await client.close();
    isConnected = false;
  }
};
