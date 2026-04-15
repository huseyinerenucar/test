import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import candidatesRouter from './routes/candidates.js';
import { initDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dev mode unless explicitly NODE_ENV=production. In dev we mount Vite in
// middleware mode so the frontend and API share an origin — no CORS, no
// proxy, no ECONNRESET.
const isDev = process.env.NODE_ENV !== 'production';

const PORT = Number(process.env.PORT) || (isDev ? 5173 : 3001);
const HOST = process.env.HOST || '127.0.0.1';

async function start() {
  await initDb();

  const app = express();

  // Ensure uploads directory exists at startup (outside server/ so node --watch ignores it)
  const uploadsDir = path.join(__dirname, '..', 'data', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Simple request logger to help diagnose issues
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (${req.headers['content-type'] || 'no-content-type'})`);
    next();
  });

  // API routes (must come before Vite middleware / static serving)
  app.use('/api/candidates', candidatesRouter);

  if (isDev) {
    // Dev: run Vite inside this Express process as middleware.
    // Same origin = no CORS, no proxy. The browser hits http://127.0.0.1:5173
    // for both the HTML/JS assets and the /api/* calls.
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve the built React app
    const distPath = path.join(__dirname, '..', 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('/{*path}', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  // Error handling middleware (catches multer errors and any other uncaught errors).
  // Registered last so it catches errors from routes AND middleware above.
  app.use((err, _req, res, _next) => {
    console.error('[ERROR]', err.message);
    console.error(err.stack);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message || 'Internal server error' });
  });

  const server = app.listen(PORT, HOST, () => {
    console.log(`HR Desk ${isDev ? 'dev' : 'server'} running on http://${HOST}:${PORT}`);
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
