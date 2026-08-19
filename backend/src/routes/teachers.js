import express from 'express'
import bcrypt from 'bcryptjs'
import pool from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/teachers — admin only
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, phone, created_at FROM users WHERE role = 'teacher' ORDER BY created_at DESC`
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/teachers — add a new teacher
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    
    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, phone) 
       VALUES ($1, $2, $3, 'teacher', $4) RETURNING id, name, email, phone`,
      [name, email, password_hash, phone]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/teachers/:id — update a teacher
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    const id = req.params.id

    if (password && password.length > 0) {
      const salt = await bcrypt.genSalt(10)
      const password_hash = await bcrypt.hash(password, salt)
      await pool.query(
        `UPDATE users SET name=$1, email=$2, phone=$3, password_hash=$4 WHERE id=$5 AND role='teacher'`,
        [name, email, phone, password_hash, id]
      )
    } else {
      await pool.query(
        `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 AND role='teacher'`,
        [name, email, phone, id]
      )
    }
    res.json({ message: 'Teacher updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/teachers/:id — remove a teacher
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const id = req.params.id
    await pool.query(`DELETE FROM users WHERE id=$1 AND role='teacher'`, [id])
    res.json({ message: 'Teacher deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
