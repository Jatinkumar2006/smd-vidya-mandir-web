import express from 'express'
import pool    from '../config/db.js'
import { sendEmail } from '../utils/mailer.js'

const router = express.Router()

// POST /api/contact — public, saves inquiry to DB
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
    if (!name || !message || !email) return res.status(400).json({ message: 'Name, email and message are required' })

    await pool.query(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)',
      [name, email, phone || null, subject || null, message]
    )

    // Send confirmation email to the user
    const emailHtml = `
      <h2 style="color: #1e3a8a; margin-top: 0;">Message Received</h2>
      <p>Dear ${name},</p>
      <p>Thank you for contacting SMD Vidya Mandir. We have successfully received your message regarding <strong>${subject || 'General Inquiry'}</strong>.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0; color: #475569; font-style: italic;">
        "${message}"
      </div>
      <p>Our team will review your inquiry and get back to you at <strong>${email}</strong> or <strong>${phone || 'your provided number'}</strong> within 24 working hours.</p>
    `
    // Fire and forget
    sendEmail({
      to: email,
      subject: `Re: ${subject || 'Your Message to SMD Vidya Mandir'}`,
      html: emailHtml
    }).catch(console.error)

    res.status(201).json({ message: 'Your message has been received. We will get back to you soon!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to send message. Please try again.' })
  }
})

export default router
