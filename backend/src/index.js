import express        from 'express'
import cors           from 'cors'
import dotenv         from 'dotenv'

import authRoutes       from './routes/auth.js'
import aiRoutes         from './routes/ai.js'
import documentsRoutes  from './routes/documents.js'
import admissionRoutes  from './routes/admissions.js'
import noticeRoutes     from './routes/notices.js'
import galleryRoutes    from './routes/gallery.js'
import studentRoutes    from './routes/students.js'
import marksRoutes      from './routes/marks.js'
import attendanceRoutes from './routes/attendance.js'
import contactRoutes    from './routes/contact.js'
import careerRoutes     from './routes/careers.js'

import teacherRoutes    from './routes/teachers.js'
import resultsRoutes    from './routes/results.js'
import leadershipRoutes from './routes/leadership.js'
import adminRoutes      from './routes/admin.js'
import settingsRoutes   from './routes/settings.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Health check
app.get('/api/health', (_, res) => res.json({
  status: 'ok',
  project: 'SMD Vidya Mandir',
  db: 'MySQL',
  ai: 'Groq (llama3-8b-8192)',
}))

// Routes
app.use('/api/auth',        authRoutes)
app.use('/api/ai',          aiRoutes)
app.use('/api/documents',   documentsRoutes)
app.use('/api/admissions',  admissionRoutes)
app.use('/api/notices',     noticeRoutes)
app.use('/api/gallery',     galleryRoutes)
app.use('/api/students',    studentRoutes)
app.use('/api/marks',       marksRoutes)
app.use('/api/attendance',  attendanceRoutes)
app.use('/api/contact',     contactRoutes)
app.use('/api/careers',     careerRoutes)

app.use('/api/teachers',    teacherRoutes)
app.use('/api/results',     resultsRoutes)
app.use('/api/leadership',  leadershipRoutes)
app.use('/api/admin',       adminRoutes)
app.use('/api/settings',    settingsRoutes)

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

app.listen(PORT, () => console.log(`✅  SMD Backend running on port ${PORT}  |  DB: MySQL  |  AI: Groq`))
