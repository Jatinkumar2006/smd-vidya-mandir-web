import express from 'express'
import pool    from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// GET /api/marks — teacher/admin see all marks (with filters)
router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { student_id, class: cls, exam_type, subject } = req.query
    let sql = `
      SELECT m.*, u.name AS student_name, s.class, s.section, s.roll_number,
             t.name AS teacher_name
      FROM marks m
      JOIN students s ON s.id = m.student_id
      JOIN users u ON u.id = s.user_id
      LEFT JOIN users t ON t.id = m.teacher_id
    `
    const params = []
    const where  = []
    if (student_id) { where.push('m.student_id = ?');  params.push(student_id) }
    if (cls)        { where.push('s.class = ?');        params.push(cls) }
    if (exam_type)  { where.push('m.exam_type = ?');    params.push(exam_type) }
    if (subject)    { where.push('m.subject = ?');      params.push(subject) }
    if (where.length) sql += ' WHERE ' + where.join(' AND ')
    sql += ' ORDER BY s.class, s.roll_number, m.subject'

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/marks/my — student sees their own marks
router.get('/my', protect, authorize('student'), async (req, res) => {
  try {
    const [student] = await pool.query('SELECT id FROM students WHERE user_id = ?', [req.user.id])
    if (!student[0]) return res.status(404).json({ message: 'Student profile not found' })

    const [rows] = await pool.query(
      `SELECT m.*, t.name AS teacher_name FROM marks m
       LEFT JOIN users t ON t.id = m.teacher_id
       WHERE m.student_id = ?
       ORDER BY m.exam_type, m.subject`,
      [student[0].id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/marks — teacher enters marks
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { student_id, subject, exam_type, marks: marksVal, max_marks } = req.body
    const [result] = await pool.query(
      'INSERT INTO marks (student_id, subject, exam_type, marks, max_marks, teacher_id) VALUES (?, ?, ?, ?, ?, ?)',
      [student_id, subject, exam_type, marksVal, max_marks || 100, req.user.id]
    )
    res.status(201).json({ message: 'Marks saved', id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT /api/marks/:id — teacher updates a mark
router.put('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { marks: marksVal, max_marks } = req.body
    await pool.query('UPDATE marks SET marks = ?, max_marks = ? WHERE id = ?',
      [marksVal, max_marks || 100, req.params.id])
    res.json({ message: 'Updated' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE /api/marks/:id — admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM marks WHERE id = ?', [req.params.id])
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
