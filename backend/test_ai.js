import Groq from 'groq-sdk'
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function test() {
  try {
    console.log('Testing DB...')
    const [noticesRes, careersRes, docsRes] = await Promise.all([
      pool.query('SELECT title, content FROM notices WHERE active = TRUE ORDER BY created_at DESC LIMIT 5'),
      pool.query('SELECT title, department, experience FROM careers WHERE active = TRUE'),
      pool.query('SELECT title, extracted_text FROM school_documents WHERE active = TRUE')
    ])
    console.log('DB SUCCESS!')

    console.log('Testing Groq...')
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: 'hello' }],
      max_tokens: 10,
    })
    console.log('GROQ SUCCESS!', response.choices[0].message.content)
  } catch (err) {
    console.error('TEST ERROR:', err.message)
  } finally {
    process.exit(0)
  }
}

test()
