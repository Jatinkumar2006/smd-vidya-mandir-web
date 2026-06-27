import express from 'express'
import pool    from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/attendance — teacher/admin
router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { student_id, date, class: cls } = req.query
    let sql = `
      SELECT a.*, u.name AS student_name, s.class, s.section, s.roll_number
      FROM attendance a
      JOIN students s ON s.id = a.student_id
      JOIN users u ON u.id = s.user_id
    `
    const params = []
    const where  = []
    if (student_id) { where.push('a.student_id = ?');  params.push(student_id) }
    if (date)       { where.push('a.date = ?');         params.push(date) }
    if (cls)        { where.push('s.class = ?');        params.push(cls) }
    if (where.length) sql += ' WHERE ' + where.join(' AND ')
    sql += ' ORDER BY a.date DESC, s.roll_number'

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/attendance/my — student sees own attendance
router.get('/my', protect, authorize('student'), async (req, res) => {
  try {
    const [student] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id])
    if (!student[0]) return res.status(404).json({ message: 'Student profile not found' })

    const [rows] = await pool.query(
      'SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC',
      [student[0].id]
    )

    // Calculate summary
    const total   = rows.length
    const present = rows.filter(r => r.status === 'present').length
    const absent  = rows.filter(r => r.status === 'absent').length
    const late    = rows.filter(r => r.status === 'late').length
    const pct     = total > 0 ? Math.round((present / total) * 100) : 0

    res.json({ records: rows, summary: { total, present, absent, late, percentage: pct } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/attendance — teacher marks attendance (batch)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { records } = req.body
    // records = [{ student_id, date, status }, ...]
    if (!records || !records.length)
      return res.status(400).json({ message: 'No records provided' })

    const values = records.map(r => [r.student_id, r.date, r.status, req.user.id])

    // Use INSERT ... ON DUPLICATE KEY UPDATE to handle re-marking
    for (const [student_id, date, status, marked_by] of values) {
      await pool.query(
        `INSERT INTO attendance (student_id, date, status, marked_by) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), marked_by = VALUES(marked_by)`,
        [student_id, date, status, marked_by]
      )
    }

    res.status(201).json({ message: `Attendance marked for ${records.length} student(s)` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
