import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'hrdesk.db');

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT '',
    title TEXT NOT NULL,
    engineering_field TEXT NOT NULL,
    skills TEXT DEFAULT '[]',
    experience TEXT DEFAULT '',
    experience_years INTEGER DEFAULT 0,
    education TEXT DEFAULT '',
    background TEXT DEFAULT '',
    osym_ranking INTEGER,
    cv_attached INTEGER DEFAULT 0,
    cv_filename TEXT,
    cv_path TEXT,
    upload_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

// Seed with mock data if the table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM candidates').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO candidates (name, email, phone, title, engineering_field, skills, experience, experience_years, education, background, osym_ranking, cv_attached, cv_filename, upload_date, status)
    VALUES (@name, @email, @phone, @title, @engineering_field, @skills, @experience, @experience_years, @education, @background, @osym_ranking, @cv_attached, @cv_filename, @upload_date, @status)
  `);

  const seedData = [
    {
      name: 'Ahmet Yilmaz',
      email: 'ahmet.yilmaz@email.com',
      phone: '+90 532 111 2233',
      title: 'Senior Frontend Developer',
      engineering_field: 'Software Engineering',
      skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind CSS']),
      experience: '5 years of experience in web development, specializing in React-based SPAs and design systems.',
      experience_years: 5,
      education: 'BSc Computer Engineering - METU',
      background: 'Previously worked at a fintech startup building real-time trading dashboards. Led a team of 3 frontend developers and established coding standards.',
      osym_ranking: 12500,
      cv_attached: 1,
      cv_filename: 'ahmet_yilmaz_cv.pdf',
      upload_date: '2025-03-15',
      status: 'Interview',
    },
    {
      name: 'Elif Demir',
      email: 'elif.demir@email.com',
      phone: '+90 544 222 3344',
      title: 'Backend Engineer',
      engineering_field: 'Computer Engineering',
      skills: JSON.stringify(['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS']),
      experience: '3 years building scalable backend services and REST APIs for e-commerce platforms.',
      experience_years: 3,
      education: 'BSc Software Engineering - Bilkent University',
      background: 'Built microservices handling 10k+ requests/second. Experienced with CI/CD pipelines and cloud-native architecture.',
      osym_ranking: 8200,
      cv_attached: 1,
      cv_filename: 'elif_demir_cv.pdf',
      upload_date: '2025-03-20',
      status: 'Reviewed',
    },
    {
      name: 'Mehmet Kara',
      email: 'mehmet.kara@email.com',
      phone: '+90 555 333 4455',
      title: 'Full Stack Developer',
      engineering_field: 'Electrical Engineering',
      skills: JSON.stringify(['JavaScript', 'React', 'Express.js', 'MongoDB', 'Redis']),
      experience: '2 years as a full-stack developer working on internal tools and customer-facing web apps.',
      experience_years: 2,
      education: 'BSc Electrical Engineering - ITU',
      background: 'Transitioned from embedded systems to web development. Strong analytical skills and hardware understanding that brings unique perspective to IoT projects.',
      osym_ranking: 15800,
      cv_attached: 0,
      cv_filename: null,
      upload_date: '2025-04-01',
      status: 'Pending CV',
    },
    {
      name: 'Zeynep Aksoy',
      email: 'zeynep.aksoy@email.com',
      phone: '+90 533 444 5566',
      title: 'DevOps Engineer',
      engineering_field: 'Computer Engineering',
      skills: JSON.stringify(['Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Go']),
      experience: '4 years managing cloud infrastructure and automating deployment pipelines for enterprise clients.',
      experience_years: 4,
      education: 'MSc Computer Engineering - Bogazici University',
      background: 'Certified AWS Solutions Architect. Managed infrastructure serving millions of users across multiple regions. Passionate about reliability engineering.',
      osym_ranking: 5400,
      cv_attached: 1,
      cv_filename: 'zeynep_aksoy_cv.pdf',
      upload_date: '2025-04-05',
      status: 'New',
    },
  ];

  const insertMany = db.transaction((candidates) => {
    for (const c of candidates) {
      insert.run(c);
    }
  });

  insertMany(seedData);
  console.log('Database seeded with 4 sample candidates.');
}

export default db;
