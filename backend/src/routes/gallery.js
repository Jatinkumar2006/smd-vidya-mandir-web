import express from 'express'
import pool    from '../config/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const { category } = req.query
  const query = category
    ? 'SELECT * FROM gallery WHERE category = $1 ORDER BY created_at DESC'
    : 'SELECT * FROM gallery ORDER BY created_at DESC'
  const { rows } = await pool.query(query, category ? [category] : [])
  res.json(rows)
})

export default router
