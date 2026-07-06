import express from 'express'
import pool    from '../config/db.js'

const router = express.Router()

// POST /api/contact — public, saves inquiry to DB
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
    if (!name || !message) return res.status(400).json({ message: 'Name and message are required' })

    await pool.query(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)',
      [name, email || null, phone || null, subject || null, message]
    )
    res.status(201).json({ message: 'Your message has been received. We will get back to you soon!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to send message. Please try again.' })
  }
})

export default router
