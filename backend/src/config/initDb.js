import fs from 'fs'
import pool from './db.js'

async function init() {
  try {
    const schema = fs.readFileSync('src/config/schema.sql', 'utf8')
    await pool.query(schema)
    console.log("Database initialized successfully with all tables!")
    process.exit(0)
  } catch (err) {
    console.error("Error initializing database:", err)
    process.exit(1)
  }
}

init()
