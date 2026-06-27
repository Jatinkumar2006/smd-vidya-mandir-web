import express from 'express'
import pool    from '../config/db.js'

const router = express.Router()

router.get('/', async (_, res) => {
  const { rows } = await pool.query('SELECT * FROM notices WHERE active = true ORDER BY created_at DESC LIMIT 10')
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { title, content } = req.body
  const { rows } = await pool.query(
    'INSERT INTO notices (title, content) VALUES ($1, $2) RETURNING *',
    [title, content]
  )
  res.status(201).json(rows[0])
})

export default router
