import express from 'express';
import { limiter } from './middleware/rateLimiter.js';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import router from './routes/index.js';
import { closeDb, getDb } from './lib/mongoClient.js';

const app = express();

app.use(cors()); // enable CORS for all origins
app.use(helmet()); // security middleware
app.use(morgan('combined')); // logging middleware
app.use(limiter); // general rate limiter to all requests
app.use(express.json());

app.use('/api', router);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route nicht gefunden' });
});

app.use((err, _req, res, _next) => {
  console.error('❌ Fehler im Request:', err);
  res.status(500).json({ message: 'Serverfehler', error: err.message });
});

const start = async () => {
  try {
    await getDb(); // validate connection on startup
    app.listen(config.port, () => {
      console.log(`🚀 Chroniq API läuft auf Port ${config.port}`);
    });
  } catch (error) {
    console.error('Serverstart fehlgeschlagen:', error);
    process.exit(1); // Exit with failure
  }
};

// Graceful shutdown on SIGINT (signal from Ctrl+C)
process.on('SIGINT', async () => {
  await closeDb();
  process.exit(0);
});

start();
