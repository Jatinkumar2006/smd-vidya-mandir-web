import express from 'express'
import Groq    from 'groq-sdk'

const router = express.Router()
const groq   = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SCHOOL_CONTEXT = `You are the official AI assistant for SMD School (Shree Mangal Chand Didwania Vidya Mandir), 
a CBSE-affiliated school in Khori Brahmanan, Raghunathgarh, Sikar, Rajasthan. 
Contact: +91-9001995272 | Email: smdvidyamandir@gmail.com
Answer ONLY school-related questions. Be friendly, concise, and helpful.
If asked something unrelated to the school, politely redirect the user.`

// POST /api/ai/chat — public chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body

    const messages = [
      { role: 'system', content: SCHOOL_CONTEXT },
      ...history.map(m => ({
        role:    m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    const response = await groq.chat.completions.create({
      model:    'llama3-8b-8192',
      messages,
      max_tokens: 512,
    })

    res.json({ reply: response.choices[0].message.content })
  } catch (err) {
    console.error('AI chat error:', err.message)
    res.status(500).json({ message: 'AI service error. Please try again.' })
  }
})

// POST /api/ai/notice — admin only (call with auth middleware where needed)
router.post('/notice', async (req, res) => {
  try {
    const { topic } = req.body
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are the principal of SMD School (Shree Mangal Chand Didwania Vidya Mandir), a CBSE school in Sikar, Rajasthan.',
        },
        {
          role: 'user',
          content: `Generate a professional school notice about: "${topic}". 
Format it as:
Date: [today's date]
Subject: [clear subject line]

[Body — 2-3 paragraphs]

Regards,
The Principal
SMD School, Sikar`,
        },
      ],
      max_tokens: 512,
    })
    res.json({ notice: response.choices[0].message.content })
  } catch (err) {
    console.error('AI notice error:', err.message)
    res.status(500).json({ message: 'AI notice generation failed' })
  }
})

// POST /api/ai/remark — teacher only
router.post('/remark', async (req, res) => {
  try {
    const { studentData } = req.body
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are a school teacher writing report card remarks for students. Be encouraging, honest, and specific.',
        },
        {
          role: 'user',
          content: `Write a personalized 2-3 sentence report card remark for this student:
${JSON.stringify(studentData, null, 2)}
The remark should mention their performance, strengths, and one area for improvement.`,
        },
      ],
      max_tokens: 200,
    })
    res.json({ remark: response.choices[0].message.content })
  } catch (err) {
    console.error('AI remark error:', err.message)
    res.status(500).json({ message: 'AI remark generation failed' })
  }
})

export default router
