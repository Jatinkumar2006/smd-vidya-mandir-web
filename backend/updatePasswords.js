import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('New hash for admin123:', hash);
  await pool.query('UPDATE users SET password_hash = $1', [hash]);
  console.log('Successfully updated all users to password admin123');
  process.exit(0);
}

run();
