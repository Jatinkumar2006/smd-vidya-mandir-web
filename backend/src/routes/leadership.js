import express from 'express'
import pool from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

// GET all leaders (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leadership ORDER BY sort_order ASC, id ASC')
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching leadership:', err)
    res.status(500).json({ error: 'Failed to fetch leadership team' })
  }
})

// POST new leader
router.post('/', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    const { name, post, sort_order } = req.body
    const imageUrl = req.file ? req.file.path : null

    const result = await pool.query(
      'INSERT INTO leadership (name, post, image_url, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, post, imageUrl, sort_order || 0]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error creating leader:', err)
    res.status(500).json({ error: 'Failed to add leader' })
  }
})

// PUT update leader
router.put('/:id', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    const { name, post, sort_order } = req.body
    
    if (req.file) {
      const imageUrl = req.file.path
      const result = await pool.query(
        'UPDATE leadership SET name = $1, post = $2, image_url = $3, sort_order = $4 WHERE id = $5 RETURNING *',
        [name, post, imageUrl, sort_order || 0, req.params.id]
      )
      if (result.rows.length === 0) return res.status(404).json({ error: 'Leader not found' })
      res.json(result.rows[0])
    } else {
      const result = await pool.query(
        'UPDATE leadership SET name = $1, post = $2, sort_order = $3 WHERE id = $4 RETURNING *',
        [name, post, sort_order || 0, req.params.id]
      )
      if (result.rows.length === 0) return res.status(404).json({ error: 'Leader not found' })
      res.json(result.rows[0])
    }
  } catch (err) {
    console.error('Error updating leader:', err)
    res.status(500).json({ error: 'Failed to update leader' })
  }
})

// DELETE leader
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM leadership WHERE id = $1', [req.params.id])
    res.json({ message: 'Leader deleted' })
  } catch (err) {
    console.error('Error deleting leader:', err)
    res.status(500).json({ error: 'Failed to delete leader' })
  }
})

export default router
