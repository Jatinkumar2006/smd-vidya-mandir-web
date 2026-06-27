import express from 'express'
import pool    from '../config/db.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { student_name, dob, class_applying, parent_name, phone, email, address } = req.body
    const { rows } = await pool.query(
      `INSERT INTO admissions (student_name, dob, class_applying, parent_name, phone, email, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [student_name, dob, class_applying, parent_name, phone, email, address]
    )
    res.status(201).json({ message: 'Application submitted!', id: rows[0].id })
  } catch {
    res.status(500).json({ message: 'Failed to submit application' })
  }
})

export default router
