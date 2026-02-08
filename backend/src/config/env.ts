import dotenv from 'dotenv';

dotenv.config();

export const requiredEnv = (key, fallback = undefined) => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config = {
  port: Number(process.env.PORT || 8080),
  mongoUri: requiredEnv('MONGODB_CONNECTION_STRING'),
};
