import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

const results = [
  { name: 'Aarav Sharma', year: 2026, class: '12th Science', score: '98.5%', desc: 'District Topper (PCM)', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop' },
  { name: 'Ananya Singh', year: 2026, class: '10th Standard', score: '98.4%', desc: '', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop' },
  { name: 'Eshaan Gupta', year: 2026, class: '12th Science', score: '97.2%', desc: 'School Topper', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
  { name: 'Priya Patel', year: 2026, class: '12th Commerce', score: '96.8%', desc: '', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop' },
  { name: 'Krish Kumar', year: 2026, class: '10th Standard', score: '96.5%', desc: '', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { name: 'Divya Verma', year: 2026, class: '12th Arts', score: '95.9%', desc: 'Subject Topper (History)', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop' },
  { name: 'Rohan Mehta', year: 2026, class: '12th Science', score: '95.5%', desc: '', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
  { name: 'Sanya Kapoor', year: 2026, class: '10th Standard', score: '94.8%', desc: '', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { name: 'Kabir Das', year: 2026, class: '12th Commerce', score: '94.2%', desc: '', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop' },
  { name: 'Aditi Joshi', year: 2026, class: '10th Standard', score: '93.7%', desc: '', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
  { name: 'Devansh Roy', year: 2026, class: '12th Science', score: '92.9%', desc: '', img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop' },
  { name: 'Meera Rajput', year: 2026, class: '12th Arts', score: '92.4%', desc: '', img: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=200&h=200&fit=crop' },
]

async function seed() {
  try {
    console.log('Clearing old results...')
    await pool.query('DELETE FROM top_results')
    
    console.log('Inserting mock students...')
    for (const r of results) {
      await pool.query(
        'INSERT INTO top_results (student_name, year, class, score, description, photo_url) VALUES ($1, $2, $3, $4, $5, $6)',
        [r.name, r.year, r.class, r.score, r.desc, r.img]
      )
    }
    console.log('✅ Successfully seeded 12 students into Neon DB!')
  } catch (error) {
    console.error('❌ Error seeding DB:', error)
  } finally {
    pool.end()
  }
}

seed()
