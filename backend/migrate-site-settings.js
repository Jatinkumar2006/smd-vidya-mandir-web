import pool from './src/config/db.js'

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        admission_year VARCHAR(50) DEFAULT '2025-26',
        student_count VARCHAR(50) DEFAULT '500+',
        years_of_excellence VARCHAR(50) DEFAULT '15+',
        expert_teachers VARCHAR(50) DEFAULT '30+',
        classes_offered VARCHAR(50) DEFAULT 'I - XII',
        school_hours TEXT DEFAULT 'Mon – Sat: 7:30 AM – 2:00 PM\nSunday: Closed'
      );
    `);
    
    // Insert default row if empty
    const { rowCount } = await pool.query('SELECT * FROM site_settings LIMIT 1');
    if (rowCount === 0) {
      await pool.query(`
        INSERT INTO site_settings (
          admission_year, student_count, years_of_excellence, expert_teachers, classes_offered, school_hours
        ) VALUES (
          '2025-26', '500+', '15+', '30+', 'I - XII', 'Mon – Sat: 7:30 AM – 2:00 PM\nSunday: Closed'
        );
      `);
    }

    console.log('Migration successful');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
migrate();
