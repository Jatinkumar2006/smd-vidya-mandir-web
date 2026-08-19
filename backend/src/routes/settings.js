import express from 'express'
import pool from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/settings - Public
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM site_settings LIMIT 1')
    if (rows.length === 0) {
      return res.json({})
    }
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/settings - Admin only
router.put('/', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      admission_year,
      student_count,
      years_of_excellence,
      expert_teachers,
      classes_offered,
      school_hours,
      require_2fa
    } = req.body

    const { rows } = await pool.query(
      `UPDATE site_settings SET 
        admission_year = $1, 
        student_count = $2, 
        years_of_excellence = $3, 
        expert_teachers = $4, 
        classes_offered = $5, 
        school_hours = $6,
        require_2fa = $7
       RETURNING *`,
      [admission_year, student_count, years_of_excellence, expert_teachers, classes_offered, school_hours, require_2fa ?? false]
    )
    
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error updating settings' })
  }
})

export default router
