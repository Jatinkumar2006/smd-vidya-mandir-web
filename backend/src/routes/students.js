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
    let paramIndex = 1
    if (cls)     { where.push(`s.class = $${paramIndex++}`);   params.push(cls) }
    if (section) { where.push(`s.section = $${paramIndex++}`); params.push(section) }
    if (where.length) sql += ' WHERE ' + where.join(' AND ')
    sql += ' ORDER BY s.class, s.roll_number'

    const { rows } = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/students/stats — admin dashboard stats
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const { rows: tRow } = await pool.query('SELECT COUNT(*) as total FROM students')
    const { rows: pRow } = await pool.query("SELECT COUNT(*) as pending FROM admissions WHERE status='pending'")
    const { rows: nRow } = await pool.query('SELECT COUNT(*) as notices FROM notices WHERE active=true')
    const { rows: gRow } = await pool.query('SELECT COUNT(*) as gallery_items FROM gallery')
    
    res.json({ 
      total_students: tRow[0].total, 
      pending_admissions: pRow[0].pending, 
      active_notices: nRow[0].notices, 
      gallery_items: gRow[0].gallery_items 
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/students/:id — single student
router.get('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT s.*, u.name, u.email, u.phone FROM students s
       JOIN users u ON u.id = s.user_id WHERE s.id = $1`,
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
  const client = await pool.connect()
  try {
    const { name, email, phone, roll_number, class: cls, section, password = 'student123' } = req.body
    await client.query('BEGIN')

    const hash = await bcrypt.hash(password, 10)
    const { rows: userRows } = await client.query(
      'INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, hash, 'student', phone || null]
    )
    const userId = userRows[0].id

    const { rows: studentRows } = await client.query(
      'INSERT INTO students (user_id, roll_number, class, section) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, roll_number, cls, section || 'A']
    )
    await client.query('COMMIT')
    res.status(201).json({ message: 'Student created', id: studentRows[0].id, user_id: userId })
  } catch (err) {
    await client.query('ROLLBACK')
    if (err.code === '23505')
      return res.status(400).json({ message: 'Email or roll number already exists' })
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  } finally {
    client.release()
  }
})

// POST /api/students/bulk — admin creates multiple students from CSV
router.post('/bulk', protect, authorize('admin'), async (req, res) => {
  const client = await pool.connect()
  try {
    const { students } = req.body
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'No students provided' })
    }

    await client.query('BEGIN')
    let addedCount = 0

    for (const student of students) {
      const { name, email, phone, roll_number, class: cls, section, password = 'student123' } = student
      if (!name || !email || !roll_number || !cls) continue // Skip invalid rows

      try {
        const hash = await bcrypt.hash(password, 10)
        const { rows: userRows } = await client.query(
          'INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [name, email, hash, 'student', phone || null]
        )
        
        await client.query(
          'INSERT INTO students (user_id, roll_number, class, section) VALUES ($1, $2, $3, $4)',
          [userRows[0].id, roll_number, cls, section || 'A']
        )
        addedCount++
      } catch (e) {
        // If one fails (e.g. duplicate email), we can choose to rollback all or just skip. 
        // We will throw to rollback the entire transaction to ensure data consistency.
        throw e
      }
    }

    await client.query('COMMIT')
    res.status(201).json({ message: `Successfully added ${addedCount} students` })
  } catch (err) {
    await client.query('ROLLBACK')
    if (err.code === '23505')
      return res.status(400).json({ message: 'Bulk upload failed: A duplicate email or roll number was found in the file or database.' })
    console.error('Bulk upload error:', err)
    res.status(500).json({ message: 'Server error during bulk upload' })
  } finally {
    client.release()
  }
})

// PUT /api/students/:id — admin updates student
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, phone, class: cls, section, roll_number } = req.body
    const { rows: student } = await pool.query('SELECT user_id FROM students WHERE id = $1', [req.params.id])
    if (!student[0]) return res.status(404).json({ message: 'Not found' })

    await pool.query('UPDATE users SET name = $1, phone = $2 WHERE id = $3', [name, phone || null, student[0].user_id])
    await pool.query(
      'UPDATE students SET class = $1, section = $2, roll_number = $3 WHERE id = $4',
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
    const { rows } = await pool.query('SELECT user_id FROM students WHERE id = $1', [req.params.id])
    if (!rows[0]) return res.status(404).json({ message: 'Not found' })
    // Deleting user cascades to student (ON DELETE CASCADE)
    await pool.query('DELETE FROM users WHERE id = $1', [rows[0].user_id])
    res.json({ message: 'Student deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
