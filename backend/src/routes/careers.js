import express from 'express'
import pool from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'
import { resumeUpload } from '../config/cloudinary.js'
import { sendEmail } from '../utils/mailer.js'
import crypto from 'crypto'

const router = express.Router()

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all active careers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM careers WHERE active = TRUE ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch careers' })
  }
})

// Submit job application
router.post('/:id/apply', resumeUpload.single('resume'), async (req, res) => {
  try {
    const { id } = req.params
    const { 
      applicant_name, email, phone, experience
    } = req.body
    
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' })
    }

    const resume_url = req.file.path

    const query = `
      INSERT INTO job_applications (career_id, applicant_name, email, phone, experience, resume_url, payment_id, order_id, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `
    const values = [id, applicant_name, email, phone, experience, resume_url, null, null, 'waived']
    const result = await pool.query(query, values)
    const application = result.rows[0]

    // Send confirmation email
    if (email) {
      const emailHtml = `
          <h2 style="color: #1e3a8a; margin-top: 0;">Job Application Received</h2>
          <p>Dear ${applicant_name},</p>
          <p>Thank you for submitting your application for the career opening at SMD Vidya Mandir.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #0f172a;">Application Summary:</p>
            <ul style="margin: 0; padding-left: 20px; color: #475569;">
              <li style="margin-bottom: 5px;"><strong>Name:</strong> ${applicant_name}</li>
              <li style="margin-bottom: 5px;"><strong>Phone:</strong> ${phone}</li>
              <li style="margin-bottom: 5px;"><strong>Experience:</strong> ${experience}</li>
            </ul>
          </div>
          <p>Our HR team will review your profile and contact you soon regarding the next steps.</p>
      `
      // Fire and forget email
      sendEmail({
        to: email,
        subject: 'Job Application Received - SMD Vidya Mandir',
        html: emailHtml
      }).catch(console.error)
    }
    
    res.status(201).json(application)
  } catch (error) {
    console.error('Error submitting application:', error)
    res.status(500).json({ error: 'Failed to submit application' })
  }
})

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all careers (including inactive)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM careers ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch careers' })
  }
})

// Get applications for a specific career
router.get('/admin/:id/applications', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM job_applications WHERE career_id = $1 ORDER BY created_at DESC', [id])
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

// Create new career
router.post('/admin', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, department, type, experience, description, active } = req.body
    const query = `
      INSERT INTO careers (title, department, type, experience, description, active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    const values = [title, department, type, experience, description, active ?? true]
    const result = await pool.query(query, values)
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating career:', error)
    res.status(500).json({ error: 'Failed to create career' })
  }
})

// Toggle active status or delete career (simplified to just toggle for now)
router.put('/admin/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params
    const { active } = req.body
    const query = `UPDATE careers SET active = $1 WHERE id = $2 RETURNING *`
    const result = await pool.query(query, [active, id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Career not found' })
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update career' })
  }
})

// Delete a career
router.delete('/admin/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM careers WHERE id = $1', [id])
    res.json({ message: 'Career deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete career' })
  }
})

export default router
