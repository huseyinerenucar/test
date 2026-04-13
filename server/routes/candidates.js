import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Uploads live outside server/ so node --watch doesn't restart on writes
const uploadsDir = path.join(__dirname, '..', '..', 'data', 'uploads');

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

// Strip internal fields (like cvPath) from the API response
function toPublic(candidate) {
  const { cvPath: _cvPath, ...publicData } = candidate;
  return publicData;
}

// GET /api/candidates — list all (newest first)
router.get('/', async (_req, res) => {
  await db.read();
  const sorted = [...db.data.candidates].sort((a, b) => b.id - a.id);
  res.json(sorted.map(toPublic));
});

// GET /api/candidates/:id — single candidate
router.get('/:id', async (req, res) => {
  await db.read();
  const candidate = db.data.candidates.find((c) => c.id === Number(req.params.id));
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  res.json(toPublic(candidate));
});

// POST /api/candidates — create new candidate (with optional CV)
router.post('/', upload.single('cv'), async (req, res) => {
  const { name, email, phone, title, engineeringField, skills, experience, education, background } = req.body;
  const osymRanking = req.body.osymRanking ? Number(req.body.osymRanking) : null;

  if (!name || !email || !title || !engineeringField) {
    return res.status(400).json({ error: 'Name, email, title, and engineering field are required' });
  }

  // Parse experience years from experience text
  const yearMatch = (experience || '').match(/(\d+)\s*year/i);
  const experienceYears = yearMatch ? parseInt(yearMatch[1], 10) : 0;

  const parsedSkills = typeof skills === 'string'
    ? skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  await db.read();
  const candidate = {
    id: db.data.nextId++,
    name,
    email,
    phone: phone || '',
    title,
    engineeringField,
    skills: parsedSkills,
    experience: experience || '',
    experienceYears,
    education: education || '',
    background: background || '',
    'OSYM siralamasi': osymRanking,
    cvAttached: Boolean(req.file),
    cvFileName: req.file ? req.file.originalname : null,
    cvPath: req.file ? req.file.filename : null,
    uploadDate: new Date().toISOString().split('T')[0],
    status: req.file ? 'New' : 'Pending CV',
  };

  db.data.candidates.push(candidate);
  await db.write();
  res.status(201).json(toPublic(candidate));
});

// PUT /api/candidates/:id — update candidate
router.put('/:id', upload.single('cv'), async (req, res) => {
  await db.read();
  const idx = db.data.candidates.findIndex((c) => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Candidate not found' });

  const existing = db.data.candidates[idx];
  const { name, email, phone, title, engineeringField, skills, experience, education, background, status } = req.body;
  const osymRanking = req.body.osymRanking !== undefined
    ? (req.body.osymRanking ? Number(req.body.osymRanking) : null)
    : existing['OSYM siralamasi'];

  const effectiveExperience = experience !== undefined ? experience : existing.experience;
  const yearMatch = effectiveExperience.match(/(\d+)\s*year/i);
  const experienceYears = yearMatch ? parseInt(yearMatch[1], 10) : existing.experienceYears;

  let parsedSkills = existing.skills;
  if (skills !== undefined) {
    parsedSkills = typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : existing.skills;
  }

  let cvAttached = existing.cvAttached;
  let cvFileName = existing.cvFileName;
  let cvPath = existing.cvPath;
  if (req.file) {
    if (existing.cvPath) {
      const oldPath = path.join(uploadsDir, existing.cvPath);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    cvAttached = true;
    cvFileName = req.file.originalname;
    cvPath = req.file.filename;
  }

  const updated = {
    ...existing,
    name: name || existing.name,
    email: email || existing.email,
    phone: phone !== undefined ? phone : existing.phone,
    title: title || existing.title,
    engineeringField: engineeringField || existing.engineeringField,
    skills: parsedSkills,
    experience: effectiveExperience,
    experienceYears,
    education: education !== undefined ? education : existing.education,
    background: background !== undefined ? background : existing.background,
    'OSYM siralamasi': osymRanking,
    cvAttached,
    cvFileName,
    cvPath,
    status: status || existing.status,
  };

  db.data.candidates[idx] = updated;
  await db.write();
  res.json(toPublic(updated));
});

// DELETE /api/candidates/:id
router.delete('/:id', async (req, res) => {
  await db.read();
  const idx = db.data.candidates.findIndex((c) => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Candidate not found' });

  const existing = db.data.candidates[idx];
  if (existing.cvPath) {
    const filePath = path.join(uploadsDir, existing.cvPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  db.data.candidates.splice(idx, 1);
  await db.write();
  res.json({ message: 'Candidate deleted' });
});

// GET /api/candidates/:id/cv — download CV
router.get('/:id/cv', async (req, res) => {
  await db.read();
  const candidate = db.data.candidates.find((c) => c.id === Number(req.params.id));
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  if (!candidate.cvPath) return res.status(404).json({ error: 'No CV attached' });

  const filePath = path.join(uploadsDir, candidate.cvPath);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'CV file not found on disk' });

  res.download(filePath, candidate.cvFileName || 'cv.pdf');
});

export default router;
