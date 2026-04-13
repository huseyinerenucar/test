import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'hrdesk.json');

const defaultData = {
  candidates: [],
  nextId: 1,
};

const adapter = new JSONFile(dbPath);
const db = new Low(adapter, defaultData);

await db.read();

// Seed with mock data if the database is empty
if (db.data.candidates.length === 0) {
  const seedData = [
    {
      name: 'Ahmet Yilmaz',
      email: 'ahmet.yilmaz@email.com',
      phone: '+90 532 111 2233',
      title: 'Senior Frontend Developer',
      engineeringField: 'Software Engineering',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind CSS'],
      experience: '5 years of experience in web development, specializing in React-based SPAs and design systems.',
      experienceYears: 5,
      education: 'BSc Computer Engineering - METU',
      background: 'Previously worked at a fintech startup building real-time trading dashboards. Led a team of 3 frontend developers and established coding standards.',
      'OSYM siralamasi': 12500,
      cvAttached: true,
      cvFileName: 'ahmet_yilmaz_cv.pdf',
      cvPath: null,
      uploadDate: '2025-03-15',
      status: 'Interview',
    },
    {
      name: 'Elif Demir',
      email: 'elif.demir@email.com',
      phone: '+90 544 222 3344',
      title: 'Backend Engineer',
      engineeringField: 'Computer Engineering',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
      experience: '3 years building scalable backend services and REST APIs for e-commerce platforms.',
      experienceYears: 3,
      education: 'BSc Software Engineering - Bilkent University',
      background: 'Built microservices handling 10k+ requests/second. Experienced with CI/CD pipelines and cloud-native architecture.',
      'OSYM siralamasi': 8200,
      cvAttached: true,
      cvFileName: 'elif_demir_cv.pdf',
      cvPath: null,
      uploadDate: '2025-03-20',
      status: 'Reviewed',
    },
    {
      name: 'Mehmet Kara',
      email: 'mehmet.kara@email.com',
      phone: '+90 555 333 4455',
      title: 'Full Stack Developer',
      engineeringField: 'Electrical Engineering',
      skills: ['JavaScript', 'React', 'Express.js', 'MongoDB', 'Redis'],
      experience: '2 years as a full-stack developer working on internal tools and customer-facing web apps.',
      experienceYears: 2,
      education: 'BSc Electrical Engineering - ITU',
      background: 'Transitioned from embedded systems to web development. Strong analytical skills and hardware understanding that brings unique perspective to IoT projects.',
      'OSYM siralamasi': 15800,
      cvAttached: false,
      cvFileName: null,
      cvPath: null,
      uploadDate: '2025-04-01',
      status: 'Pending CV',
    },
    {
      name: 'Zeynep Aksoy',
      email: 'zeynep.aksoy@email.com',
      phone: '+90 533 444 5566',
      title: 'DevOps Engineer',
      engineeringField: 'Computer Engineering',
      skills: ['Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Go'],
      experience: '4 years managing cloud infrastructure and automating deployment pipelines for enterprise clients.',
      experienceYears: 4,
      education: 'MSc Computer Engineering - Bogazici University',
      background: 'Certified AWS Solutions Architect. Managed infrastructure serving millions of users across multiple regions. Passionate about reliability engineering.',
      'OSYM siralamasi': 5400,
      cvAttached: true,
      cvFileName: 'zeynep_aksoy_cv.pdf',
      cvPath: null,
      uploadDate: '2025-04-05',
      status: 'New',
    },
  ];

  for (const seed of seedData) {
    db.data.candidates.push({ id: db.data.nextId++, ...seed });
  }

  await db.write();
  console.log('Database seeded with 4 sample candidates.');
}

export default db;
