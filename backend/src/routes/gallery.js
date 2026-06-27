import express from 'express'
import pool    from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/gallery — public, optional ?category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    let sql    = 'SELECT * FROM gallery ORDER BY created_at DESC'
    const params = []
    if (category && category !== 'all') {
      sql = 'SELECT * FROM gallery WHERE category = ? ORDER BY created_at DESC'
      params.push(category)
    }
    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/gallery — admin only
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, image_url, category } = req.body
    const [result] = await pool.query(
      'INSERT INTO gallery (title, image_url, category) VALUES (?, ?, ?)',
      [title, image_url, category || 'general']
    )
    const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/gallery/:id — admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
