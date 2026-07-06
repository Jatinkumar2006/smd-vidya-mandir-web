import express from 'express'
import pool    from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/notices — public (active only)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM notices WHERE active = true ORDER BY created_at DESC LIMIT 10'
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
    const { rows } = await pool.query(
      'INSERT INTO notices (title, content, created_by) VALUES ($1, $2, $3) RETURNING *',
      [title, content, req.user.id]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/notices/:id — admin only (soft delete)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE notices SET active = false WHERE id = $1', [req.params.id])
    res.json({ message: 'Notice removed' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
