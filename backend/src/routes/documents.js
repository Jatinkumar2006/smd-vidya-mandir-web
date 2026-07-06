import express from 'express'
import pool from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'
import { documentUpload } from '../config/cloudinary.js'
import Groq from 'groq-sdk'

const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// GET all documents (Public for MPD page)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM school_documents WHERE active = TRUE ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
})

// POST new document (upload image -> OCR -> save to DB)
router.post('/', protect, authorize('admin'), documentUpload.single('file'), async (req, res) => {
  try {
    const { title, doc_type } = req.body
    if (!req.file) return res.status(400).json({ error: 'Image file is required (jpg/png/webp)' })

    const fileUrl = req.file.path

    // Perform OCR using Groq Vision Model
    let extractedText = ''
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.2-11b-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'You are an OCR system. Extract ALL text, numbers, and tables from this image perfectly. Maintain structure. Output ONLY the extracted text with no other commentary.' },
              { type: 'image_url', image_url: { url: fileUrl } }
            ]
          }
        ],
        max_tokens: 1024,
      })
      extractedText = completion.choices[0].message.content
    } catch (ocrError) {
      console.error('OCR Extraction failed:', ocrError.message)
      // We still save the document even if OCR fails, but extracted text will be empty/error message.
      extractedText = '[OCR Failed or image unreadable]'
    }

    const query = `
      INSERT INTO school_documents (title, doc_type, file_url, extracted_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await pool.query(query, [title, doc_type || 'general', fileUrl, extractedText])
    res.status(201).json(result.rows[0])

  } catch (err) {
    console.error('Document upload error:', err)
    res.status(500).json({ error: 'Failed to upload document' })
  }
})

// DELETE document
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM school_documents WHERE id = $1', [req.params.id])
    res.json({ message: 'Document deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete document' })
  }
})

export default router
