import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = express.Router()
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const SCHOOL_CONTEXT = `You are the official AI assistant for SMD School (Shree Mangal Chand Didwania Vidya Mandir), 
a CBSE-affiliated school in Khori Brahmanan, Raghunathgarh, Sikar, Rajasthan. 
Contact: +91-9001995272. Answer only school-related questions. Be concise and friendly.`

router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const chat  = model.startChat({
      history: [
        { role: 'user',  parts: [{ text: SCHOOL_CONTEXT }] },
        { role: 'model', parts: [{ text: 'Understood. I am the SMD School AI assistant.' }] },
        ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }))
      ]
    })
    const result = await chat.sendMessage(message)
    res.json({ reply: result.response.text() })
  } catch {
    res.status(500).json({ message: 'AI service error' })
  }
})

router.post('/notice', async (req, res) => {
  try {
    const { topic } = req.body
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(
      `Generate a professional school notice for SMD School about: "${topic}". Format with Date, Subject, Body, Principal signature.`
    )
    res.json({ notice: result.response.text() })
  } catch {
    res.status(500).json({ message: 'AI service error' })
  }
})

router.post('/remark', async (req, res) => {
  try {
    const { studentData } = req.body
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(
      `Generate a personalized 2-3 sentence report card remark for: ${JSON.stringify(studentData)}. Be encouraging and honest.`
    )
    res.json({ remark: result.response.text() })
  } catch {
    res.status(500).json({ message: 'AI service error' })
  }
})

export default router
