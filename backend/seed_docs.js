import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const docs = [
    { title: 'CBSE - Affiliation', cat: 'General Documents', file: '/doc/Cbse-Affiliation.pdf' },
    { title: 'Land Certificate', cat: 'General Documents', file: '/doc/Land-Certificate.pdf' },
    { title: 'NOC', cat: 'Certifications & Reports', file: '/doc/NOC.pdf' },
    { title: 'Recognition', cat: 'Certifications & Reports', file: '/doc/Recognition.pdf' },
    { title: 'Self Certificate', cat: 'Certifications & Reports', file: '/doc/Self-Certificate.pdf' },
    { title: 'Society Registration', cat: 'Certifications & Reports', file: '/doc/Society-Registration.pdf' },
    { title: 'Water-Test-Report', cat: 'Certifications & Reports', file: '/doc/Water-Test-Report.pdf' }
  ];

  for (const doc of docs) {
    try {
      await pool.query(
        'INSERT INTO school_documents (title, doc_type, file_url) VALUES ($1, $2, $3)',
        [doc.title, doc.cat, doc.file]
      );
    } catch (e) {
      console.error(e.message);
    }
  }
  console.log('Seeded documents');
  pool.end();
}

run();
