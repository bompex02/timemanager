import { initializeApp } from 'firebase/app';
import { getAuth, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { requiredEnv } from './env.js';

// Firebase client configuration used on the server to mirror the v1 AuthService flows.
const firebaseConfig = {
  apiKey: requiredEnv('FIREBASE_API_KEY'),
  authDomain: requiredEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: requiredEnv('FIREBASE_PROJECT_ID'),
  storageBucket: requiredEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requiredEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: requiredEnv('FIREBASE_APP_ID'),
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Avoid persisted sessions on the server; keep auth state in memory only.
setPersistence(auth, inMemoryPersistence).catch((error) => {
  console.error('Failed to set Firebase auth persistence', error);
});

export { auth, firebaseConfig };
