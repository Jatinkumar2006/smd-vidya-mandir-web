import express from 'express'
import pool from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

// GET /api/results — Public route to fetch all results
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM top_results ORDER BY year DESC, score DESC')
    res.json(result.rows)
  } catch (err) {
    console.error('Error fetching results:', err)
    res.status(500).json({ error: 'Failed to fetch results' })
  }
})

// POST /api/results — Upload new result (Admin only)
router.post('/', protect, authorize('admin'), upload.single('photo'), async (req, res) => {
  try {
    const { student_name, year, student_class, score, description } = req.body
    if (!req.file) return res.status(400).json({ error: 'Student photo is required' })

    const photo_url = req.file.path

    const query = `
      INSERT INTO top_results (student_name, year, class, score, description, photo_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    const result = await pool.query(query, [student_name, year, student_class, score, description || '', photo_url])
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Result upload error:', err)
    res.status(500).json({ error: 'Failed to upload result' })
  }
})

// PUT /api/results/:id — Update existing result (Admin only)
router.put('/:id', protect, authorize('admin'), upload.single('photo'), async (req, res) => {
  try {
    const { student_name, year, student_class, score, description } = req.body
    const id = req.params.id

    if (req.file) {
      // User uploaded a new photo
      const photo_url = req.file.path
      const query = `
        UPDATE top_results 
        SET student_name = $1, year = $2, class = $3, score = $4, description = $5, photo_url = $6
        WHERE id = $7 RETURNING *
      `
      const result = await pool.query(query, [student_name, year, student_class, score, description || '', photo_url, id])
      if (result.rows.length === 0) return res.status(404).json({ error: 'Result not found' })
      res.json(result.rows[0])
    } else {
      // Update without changing photo
      const query = `
        UPDATE top_results 
        SET student_name = $1, year = $2, class = $3, score = $4, description = $5
        WHERE id = $6 RETURNING *
      `
      const result = await pool.query(query, [student_name, year, student_class, score, description || '', id])
      if (result.rows.length === 0) return res.status(404).json({ error: 'Result not found' })
      res.json(result.rows[0])
    }
  } catch (err) {
    console.error('Result update error:', err)
    res.status(500).json({ error: 'Failed to update result' })
  }
})

// DELETE /api/results/:id — Remove a result
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM top_results WHERE id = $1', [req.params.id])
    res.json({ message: 'Result deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete result' })
  }
})

export default router
