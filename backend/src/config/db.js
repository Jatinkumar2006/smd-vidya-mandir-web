import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

// Add a test query to verify connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Failed to connect to PostgreSQL database:', err.stack)
  } else {
    console.log('✅ Connected to PostgreSQL database successfully!')
  }
})

export default pool
