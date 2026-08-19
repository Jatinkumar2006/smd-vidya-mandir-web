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
    // Send confirmation email to parent
    if (email) {
      const emailHtml = `
          <h2 style="color: #1e3a8a; margin-top: 0;">Admission Inquiry Received</h2>
          <p>Dear ${parent_name},</p>
          <p>Thank you for submitting an admission inquiry for your child, <strong>${student_name}</strong>, for Class <strong>${class_applying}</strong> at SMD Vidya Mandir.</p>
          <p>We have successfully received your details. Our admissions team will review the application and contact you at <strong>${phone}</strong> very soon.</p>
      `
      // Fire and forget email (don't wait for it to finish)
      sendEmail({
        to: email,
        subject: 'Admission Inquiry Received - SMD Vidya Mandir',
        html: emailHtml
      }).catch(console.error)
    }

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
