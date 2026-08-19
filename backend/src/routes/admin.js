import express from 'express'
import pool    from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const studentsRes = await pool.query('SELECT COUNT(*) FROM students')
    const admissionsRes = await pool.query("SELECT COUNT(*) FROM admissions WHERE status = 'pending'")
    const noticesRes = await pool.query('SELECT COUNT(*) FROM notices WHERE active = true')
    const galleryRes = await pool.query('SELECT COUNT(*) FROM gallery')
    
    res.json({
      total_students: parseInt(studentsRes.rows[0].count),
      pending_admissions: parseInt(admissionsRes.rows[0].count),
      active_notices: parseInt(noticesRes.rows[0].count),
      gallery_items: parseInt(galleryRes.rows[0].count)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
