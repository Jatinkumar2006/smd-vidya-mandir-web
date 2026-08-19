import express from 'express'
import pool from '../config/db.js'
import { protect, authorize } from '../middleware/auth.js'
import { documentUpload } from '../config/cloudinary.js'
import Groq from 'groq-sdk'
import { PDFParse } from 'pdf-parse'

const router = express.Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function extractDocumentText(fileUrl, mimetype, groqClient) {
  let extractedText = ''
  if (mimetype === 'application/pdf') {
    let parser = null
    try {
      const response = await fetch(fileUrl)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      if (buffer.length === 0) throw new Error('Empty PDF buffer, nothing to parse.')
      
      parser = new PDFParse({ data: buffer })
      const result = await parser.getText()
      extractedText = result.text.trim()

      if (extractedText.length < 20) {
        console.log('Detected scanned PDF. Taking screenshot of first page for Vision OCR...')
        const screen = await parser.getScreenshot({ first: 1, scale: 2 })
        const dataUri = screen.pages[0].dataUrl

        const completion = await groqClient.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Extract all the text from this document image. Return only the extracted text, no other comments.' },
                { type: 'image_url', image_url: { url: dataUri } }
              ]
            }
          ],
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          temperature: 0,
        })
        extractedText = completion.choices[0].message.content
      }
    } catch (error) {
      console.error('PDF parsing failed:', error.message)
      throw new Error('PDF parsing failed or document unreadable')
    } finally {
      if (parser) await parser.destroy()
    }
  } else if (mimetype.startsWith('image/')) {
    try {
      const response = await fetch(fileUrl)
      const arrayBuffer = await response.arrayBuffer()
      const base64Image = Buffer.from(arrayBuffer).toString('base64')
      const dataUri = `data:${mimetype};base64,${base64Image}`

      const completion = await groqClient.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract all the text from this document image. Return only the extracted text, no other comments.' },
              { type: 'image_url', image_url: { url: dataUri } }
            ]
          }
        ],
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0,
      })
      extractedText = completion.choices[0].message.content
    } catch (error) {
      console.error('Image OCR failed:', error.message)
      throw new Error('Image OCR failed or document unreadable')
    }
  }
  return extractedText
}

// GET document proxy view for inline PDF rendering
router.get('/view/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT file_url, title FROM school_documents WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) return res.status(404).send('Document not found')
    
    const doc = result.rows[0]
    const response = await fetch(doc.file_url)
    
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="${doc.title}.pdf"`)
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    res.send(buffer)
  } catch (err) {
    console.error('Proxy view error:', err)
    res.status(500).send('Error viewing document')
  }
})

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
    const { title, doc_type, share_with_ai } = req.body
    const isShared = share_with_ai === 'true' || share_with_ai === true
    if (!req.file) return res.status(400).json({ error: 'Image file is required (jpg/png/webp)' })

    const fileUrl = req.file.path
    const extractedText = isShared ? await extractDocumentText(fileUrl, req.file.mimetype, groq) : null

    const query = `
      INSERT INTO school_documents (title, doc_type, file_url, extracted_text, share_with_ai)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
    const result = await pool.query(query, [title, doc_type || 'general', fileUrl, extractedText, isShared])
    res.status(201).json(result.rows[0])

  } catch (err) {
    console.error('Document upload error:', err)
    res.status(500).json({ error: 'Failed to upload document' })
  }
})

// UPDATE document title/category
router.put('/:id', protect, authorize('admin'), documentUpload.single('file'), async (req, res) => {
  try {
    const { title, doc_type, share_with_ai } = req.body
    const isShared = share_with_ai === 'true' || share_with_ai === true
    
    if (req.file) {
      const fileUrl = req.file.path
      const extractedText = isShared ? await extractDocumentText(fileUrl, req.file.mimetype, groq) : null
      
      const result = await pool.query(
        'UPDATE school_documents SET title = $1, doc_type = $2, file_url = $3, extracted_text = $4, share_with_ai = $5 WHERE id = $6 RETURNING *',
        [title, doc_type, fileUrl, extractedText, isShared, req.params.id]
      )
      if (result.rows.length === 0) return res.status(404).json({ error: 'Document not found' })
      res.json(result.rows[0])
    } else {
      const result = await pool.query(
        'UPDATE school_documents SET title = $1, doc_type = $2, share_with_ai = $3, extracted_text = CASE WHEN $3 = false THEN null ELSE extracted_text END WHERE id = $4 RETURNING *',
        [title, doc_type, isShared, req.params.id]
      )
      if (result.rows.length === 0) return res.status(404).json({ error: 'Document not found' })
      res.json(result.rows[0])
    }
  } catch (err) {
    console.error('Document update error:', err)
    res.status(500).json({ error: 'Failed to update document' })
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
