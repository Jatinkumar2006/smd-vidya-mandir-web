import express from 'express'
import pool    from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'
import { sendEmail } from '../utils/mailer.js'

const router = express.Router()

// GET /api/admissions — admin only
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.query
    let sql = 'SELECT * FROM admissions ORDER BY created_at DESC'
    const params = []
    if (status) {
      sql = 'SELECT * FROM admissions WHERE status = $1 ORDER BY created_at DESC'
      params.push(status)
    }
    const { rows } = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/admissions — public
router.post('/', async (req, res) => {
  try {
    const { student_name, dob, gender, class_applying, parent_name, relation, phone, email, address } = req.body
    const { rows } = await pool.query(
      `INSERT INTO admissions (student_name, dob, gender, class_applying, parent_name, relation, phone, email, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [student_name, dob || null, gender || null, class_applying, parent_name, relation || 'Father', phone, email || null, address || null]
    )
    res.status(201).json({ message: 'Application submitted successfully!', id: rows[0].id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to submit application' })
  }
})

// PUT /api/admissions/:id/status — admin only
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body
    if (!['pending', 'approved', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status' })
    await pool.query('UPDATE admissions SET status = $1 WHERE id = $2', [status, req.params.id])
    res.json({ message: `Application ${status}` })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/admissions/:id — admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM admissions WHERE id = $1', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
