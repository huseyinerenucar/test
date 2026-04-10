import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import candidatesRouter from './routes/candidates.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/candidates', candidatesRouter);

// In production, serve the built React app
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`HR Desk API server running on http://localhost:${PORT}`);
});
