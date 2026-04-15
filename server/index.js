import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import candidatesRouter from './routes/candidates.js';
import { initDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '127.0.0.1';

async function start() {
  await initDb();

  const app = express();

  // Ensure uploads directory exists at startup (outside server/ so node --watch ignores it)
  const uploadsDir = path.join(__dirname, '..', 'data', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Explicit CORS middleware — the `cors` package appeared to drop its
  // headers under Express v5 on some Windows setups, so we set them
  // directly. The dev frontend (Vite on :5173) calls this server on
  // :3001 cross-origin; in production the server serves the built assets
  // and these headers are harmless.
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Simple request logger to help diagnose issues
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (${req.headers['content-type'] || 'no-content-type'})`);
    next();
  });

  // API routes
  app.use('/api/candidates', candidatesRouter);

  // Error handling middleware (catches multer errors and any other uncaught errors)
  app.use((err, _req, res, _next) => {
    console.error('[ERROR]', err.message);
    console.error(err.stack);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message || 'Internal server error' });
  });

  // In production, serve the built React app
  const distPath = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('/{*path}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`HR Desk API server running on http://${HOST}:${PORT}`);
  });

  // Disable Node's default request/header timeouts for large uploads on slow disks
  server.requestTimeout = 0;
  server.headersTimeout = 0;
}

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
});
process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION]', err);
});

start().catch((err) => {
  console.error('[STARTUP FAILED]', err);
  process.exit(1);
});
