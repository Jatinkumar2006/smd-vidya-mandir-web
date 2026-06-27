import express   from 'express'
import cors      from 'cors'
import dotenv    from 'dotenv'
import authRoutes      from './routes/auth.js'
import aiRoutes        from './routes/ai.js'
import admissionRoutes from './routes/admissions.js'
import noticeRoutes    from './routes/notices.js'
import galleryRoutes   from './routes/gallery.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/api/health', (_, res) => res.json({ status: 'ok', project: 'SMD Digital Campus' }))

app.use('/api/auth',       authRoutes)
app.use('/api/ai',         aiRoutes)
app.use('/api/admissions', admissionRoutes)
app.use('/api/notices',    noticeRoutes)
app.use('/api/gallery',    galleryRoutes)

app.listen(PORT, () => console.log(`SMD Backend running on port ${PORT}`))
