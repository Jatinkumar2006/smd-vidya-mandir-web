import pool from './src/config/db.js'

async function migrate() {
  try {
    await pool.query('ALTER TABLE gallery ADD COLUMN IF NOT EXISTS album_sort_order INTEGER DEFAULT 0;');
    console.log('Migration successful');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
migrate();
