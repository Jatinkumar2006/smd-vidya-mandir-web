import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const query = `
CREATE TABLE IF NOT EXISTS top_results (
  id SERIAL PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  class VARCHAR(50) NOT NULL,
  score VARCHAR(50) NOT NULL,
  description VARCHAR(200),
  photo_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool.query(query, (err, res) => {
  if (err) {
    console.error('Error creating top_results table:', err);
  } else {
    console.log('Successfully created top_results table!');
  }
  process.exit();
});
