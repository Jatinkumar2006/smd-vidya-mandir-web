import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
  try {
    const schemaPath = path.join(__dirname, 'src', 'config', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema.sql...');
    await pool.query(schema);
    console.log('Database schema successfully updated.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb();
