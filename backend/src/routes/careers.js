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
      applicant_name, email, phone, experience, 
      razorpay_payment_id, razorpay_order_id, razorpay_signature 
    } = req.body
    
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' })
    }

    // Verify Razorpay Signature
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Payment details missing' })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret'
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' })
    }

    const resume_url = req.file.path

    const query = `
      INSERT INTO job_applications (career_id, applicant_name, email, phone, experience, resume_url, payment_id, order_id, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `
    const values = [id, applicant_name, email, phone, experience, resume_url, razorpay_payment_id, razorpay_order_id, 'completed']
    const result = await pool.query(query, values)
    const application = result.rows[0]

    // Send confirmation email
    if (email) {
      const emailHtml = `
        <div style="font-family: sans-serif; max-w-lg; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Job Application Received</h2>
          <p>Dear ${applicant_name},</p>
          <p>Thank you for submitting your application and completing the registration fee for the career opening at SMD Vidya Mandir.</p>
          <p>Here is a copy of your submitted details:</p>
          <ul>
            <li><strong>Name:</strong> ${applicant_name}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Experience:</strong> ${experience}</li>
            <li><strong>Payment ID:</strong> ${razorpay_payment_id}</li>
          </ul>
          <p>Our HR team will review your profile and contact you soon regarding the next steps.</p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>SMD Vidya Mandir</strong></p>
        </div>
      `
      await sendEmail({
        to: email,
        subject: 'Job Application Received - SMD Vidya Mandir',
        html: emailHtml
      })
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
