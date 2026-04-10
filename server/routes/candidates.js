import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

const router = Router();

// Multer config for CV uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Helper to format a DB row into the API response shape
function formatCandidate(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    title: row.title,
    engineeringField: row.engineering_field,
    skills: JSON.parse(row.skills || '[]'),
    experience: row.experience,
    experienceYears: row.experience_years,
    education: row.education,
    background: row.background,
    'OSYM siralamasi': row.osym_ranking,
    cvAttached: Boolean(row.cv_attached),
    cvFileName: row.cv_filename,
    uploadDate: row.upload_date,
    status: row.status,
  };
}

// GET /api/candidates — list all
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM candidates ORDER BY id DESC').all();
  res.json(rows.map(formatCandidate));
});

// GET /api/candidates/:id — single candidate
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM candidates WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Candidate not found' });
  res.json(formatCandidate(row));
});

// POST /api/candidates — create new candidate (with optional CV upload)
router.post('/', upload.single('cv'), (req, res) => {
  const { name, email, phone, title, engineeringField, skills, experience, education, background } = req.body;
  const osymRanking = req.body.osymRanking ? Number(req.body.osymRanking) : null;

  if (!name || !email || !title || !engineeringField) {
    return res.status(400).json({ error: 'Name, email, title, and engineering field are required' });
  }

  // Parse experience years from experience text
  const yearMatch = (experience || '').match(/(\d+)\s*year/i);
  const experienceYears = yearMatch ? parseInt(yearMatch[1], 10) : 0;

  const parsedSkills = typeof skills === 'string'
    ? JSON.stringify(skills.split(',').map(s => s.trim()).filter(Boolean))
    : JSON.stringify([]);

  const cvAttached = req.file ? 1 : 0;
  const cvFilename = req.file ? req.file.originalname : null;
  const cvPath = req.file ? req.file.filename : null;
  const uploadDate = new Date().toISOString().split('T')[0];
  const status = cvAttached ? 'New' : 'Pending CV';

  const stmt = db.prepare(`
    INSERT INTO candidates (name, email, phone, title, engineering_field, skills, experience, experience_years, education, background, osym_ranking, cv_attached, cv_filename, cv_path, upload_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name, email, phone || '', title, engineeringField,
    parsedSkills, experience || '', experienceYears,
    education || '', background || '', osymRanking,
    cvAttached, cvFilename, cvPath, uploadDate, status
  );

  const newRow = db.prepare('SELECT * FROM candidates WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(formatCandidate(newRow));
});

// PUT /api/candidates/:id — update candidate
router.put('/:id', upload.single('cv'), (req, res) => {
  const existing = db.prepare('SELECT * FROM candidates WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Candidate not found' });

  const { name, email, phone, title, engineeringField, skills, experience, education, background, status } = req.body;
  const osymRanking = req.body.osymRanking ? Number(req.body.osymRanking) : existing.osym_ranking;

  const yearMatch = (experience || existing.experience).match(/(\d+)\s*year/i);
  const experienceYears = yearMatch ? parseInt(yearMatch[1], 10) : existing.experience_years;

  let parsedSkills = existing.skills;
  if (skills !== undefined) {
    parsedSkills = typeof skills === 'string'
      ? JSON.stringify(skills.split(',').map(s => s.trim()).filter(Boolean))
      : existing.skills;
  }

  let cvAttached = existing.cv_attached;
  let cvFilename = existing.cv_filename;
  let cvPath = existing.cv_path;
  if (req.file) {
    // Remove old file if it exists
    if (existing.cv_path) {
      const oldPath = path.join(uploadsDir, existing.cv_path);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    cvAttached = 1;
    cvFilename = req.file.originalname;
    cvPath = req.file.filename;
  }

  const stmt = db.prepare(`
    UPDATE candidates SET
      name = ?, email = ?, phone = ?, title = ?, engineering_field = ?,
      skills = ?, experience = ?, experience_years = ?, education = ?,
      background = ?, osym_ranking = ?, cv_attached = ?, cv_filename = ?,
      cv_path = ?, status = ?, updated_at = datetime('now')
    WHERE id = ?
  `);

  stmt.run(
    name || existing.name,
    email || existing.email,
    phone !== undefined ? phone : existing.phone,
    title || existing.title,
    engineeringField || existing.engineering_field,
    parsedSkills,
    experience !== undefined ? experience : existing.experience,
    experienceYears,
    education !== undefined ? education : existing.education,
    background !== undefined ? background : existing.background,
    osymRanking,
    cvAttached, cvFilename, cvPath,
    status || existing.status,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM candidates WHERE id = ?').get(req.params.id);
  res.json(formatCandidate(updated));
});

// DELETE /api/candidates/:id
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM candidates WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Candidate not found' });

  // Remove CV file if it exists
  if (existing.cv_path) {
    const filePath = path.join(uploadsDir, existing.cv_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  db.prepare('DELETE FROM candidates WHERE id = ?').run(req.params.id);
  res.json({ message: 'Candidate deleted' });
});

// GET /api/candidates/:id/cv — download CV
router.get('/:id/cv', (req, res) => {
  const row = db.prepare('SELECT * FROM candidates WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Candidate not found' });
  if (!row.cv_path) return res.status(404).json({ error: 'No CV attached' });

  const filePath = path.join(uploadsDir, row.cv_path);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'CV file not found on disk' });

  res.download(filePath, row.cv_filename || 'cv.pdf');
});

export default router;
