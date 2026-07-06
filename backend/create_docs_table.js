import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const query = `
CREATE TABLE IF NOT EXISTS school_documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  cloudinary_url VARCHAR(500) NOT NULL,
  extracted_text TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
`;

pool.query(query, (err, res) => {
  if (err) {
    console.error('Error creating table:', err);
  } else {
    console.log('Successfully created school_documents table!');
  }
  process.exit();
});
