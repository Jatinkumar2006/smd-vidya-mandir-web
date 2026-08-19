import pool from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function updateAdminEmail() {
  try {
    const res = await pool.query(
      "UPDATE users SET email = 'smdvidyamandir1@gmail.com' WHERE role = 'admin' RETURNING *"
    );
    if (res.rows.length > 0) {
      console.log('Admin email updated successfully:', res.rows[0].email);
    } else {
      console.log('No admin user found!');
    }
  } catch (error) {
    console.error('Error updating admin email:', error);
  } finally {
    process.exit(0);
  }
}

updateAdminEmail();
