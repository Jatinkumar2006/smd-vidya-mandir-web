import express from 'express'
import pool    from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

// GET /api/gallery — public, optional ?category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    let sql    = 'SELECT * FROM gallery ORDER BY created_at DESC'
    const params = []
    if (category && category !== 'all') {
      sql = 'SELECT * FROM gallery WHERE category = $1 ORDER BY created_at DESC'
      params.push(category)
    }
    const { rows } = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/gallery — admin only (handles multiple file uploads via cloudinary)
router.post('/', protect, authorize('admin'), upload.array('images', 20), async (req, res) => {
  try {
    const { title, category } = req.body

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' })
    }

    const insertedRows = [];
    for (const file of req.files) {
      const { rows } = await pool.query(
        'INSERT INTO gallery (title, image_url, category) VALUES ($1, $2, $3) RETURNING *',
        [title, file.path, category || 'general']
      )
      insertedRows.push(rows[0]);
    }
    
    res.status(201).json(insertedRows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error uploading file' })
  }
})

// DELETE /api/gallery/:id — admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM gallery WHERE id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
