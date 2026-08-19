import pool from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function add2faColumn() {
  try {
    // Add column if it doesn't exist
    await pool.query(`
      ALTER TABLE site_settings 
      ADD COLUMN IF NOT EXISTS require_2fa BOOLEAN DEFAULT false;
    `);
    console.log('Successfully added require_2fa column to site_settings.');
  } catch (error) {
    console.error('Error adding column:', error);
  } finally {
    process.exit(0);
  }
}

add2faColumn();
