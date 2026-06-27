import express from 'express'
import pool    from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/notices — public (active only)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notices WHERE active = 1 ORDER BY created_at DESC LIMIT 10'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/notices — admin only
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, content } = req.body
    const [result] = await pool.query(
      'INSERT INTO notices (title, content, created_by) VALUES (?, ?, ?)',
      [title, content, req.user.id]
    )
    const [rows] = await pool.query('SELECT * FROM notices WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/notices/:id — admin only (soft delete)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE notices SET active = 0 WHERE id = ?', [req.params.id])
    res.json({ message: 'Notice removed' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
