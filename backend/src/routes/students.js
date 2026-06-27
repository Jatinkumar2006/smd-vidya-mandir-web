import express from 'express'
import bcrypt  from 'bcryptjs'
import pool    from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/students — admin/teacher
router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { class: cls, section } = req.query
    let sql = `
      SELECT s.id, s.roll_number, s.class, s.section,
             u.id AS user_id, u.name, u.email, u.phone,
             p.name AS parent_name
      FROM students s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN users p ON p.id = s.parent_id
    `
    const params = []
    const where = []
    if (cls)     { where.push('s.class = ?');   params.push(cls) }
    if (section) { where.push('s.section = ?'); params.push(section) }
    if (where.length) sql += ' WHERE ' + where.join(' AND ')
    sql += ' ORDER BY s.class, s.roll_number'

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/students/stats — admin dashboard stats
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const [[{ total }]]         = await pool.query('SELECT COUNT(*) as total FROM students')
    const [[{ pending }]]       = await pool.query("SELECT COUNT(*) as pending FROM admissions WHERE status='pending'")
    const [[{ notices }]]       = await pool.query('SELECT COUNT(*) as notices FROM notices WHERE active=1')
    const [[{ gallery_items }]] = await pool.query('SELECT COUNT(*) as gallery_items FROM gallery')
    res.json({ total_students: total, pending_admissions: pending, active_notices: notices, gallery_items })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/students/:id — single student
router.get('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, u.name, u.email, u.phone FROM students s
       JOIN users u ON u.id = s.user_id WHERE s.id = ?`,
      [req.params.id]
    )
    if (!rows[0]) return res.status(404).json({ message: 'Student not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/students — admin creates student (creates user + student record)
router.post('/', protect, authorize('admin'), async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { name, email, phone, roll_number, class: cls, section, password = 'student123' } = req.body
    await conn.beginTransaction()

    const hash = await bcrypt.hash(password, 10)
    const [userResult] = await conn.query(
      'INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, hash, 'student', phone || null]
    )
    const userId = userResult.insertId

    const [studentResult] = await conn.query(
      'INSERT INTO students (user_id, roll_number, class, section) VALUES (?, ?, ?, ?)',
      [userId, roll_number, cls, section || 'A']
    )
    await conn.commit()
    res.status(201).json({ message: 'Student created', id: studentResult.insertId, user_id: userId })
  } catch (err) {
    await conn.rollback()
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'Email or roll number already exists' })
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  } finally {
    conn.release()
  }
})

// PUT /api/students/:id — admin updates student
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, phone, class: cls, section, roll_number } = req.body
    const [student] = await pool.query('SELECT user_id FROM students WHERE id = ?', [req.params.id])
    if (!student[0]) return res.status(404).json({ message: 'Not found' })

    await pool.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone || null, student[0].user_id])
    await pool.query(
      'UPDATE students SET class = ?, section = ?, roll_number = ? WHERE id = ?',
      [cls, section, roll_number, req.params.id]
    )
    res.json({ message: 'Updated' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/students/:id — admin deletes student (cascades via FK)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id FROM students WHERE id = ?', [req.params.id])
    if (!rows[0]) return res.status(404).json({ message: 'Not found' })
    // Deleting user cascades to student (ON DELETE CASCADE)
    await pool.query('DELETE FROM users WHERE id = ?', [rows[0].user_id])
    res.json({ message: 'Student deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
