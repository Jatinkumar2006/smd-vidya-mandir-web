import express from 'express'
import Razorpay from 'razorpay'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret'
})

// Create an order for ₹100
router.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: 100 * 100, // amount in smallest currency unit (paise for INR) - 100 INR
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    }
    
    const order = await razorpay.orders.create(options)
    
    if (!order) {
      return res.status(500).json({ error: 'Failed to create Razorpay order' })
    }
    
    res.json(order)
  } catch (error) {
    console.error('Razorpay order error:', error)
    res.status(500).json({ error: 'Failed to create payment order' })
  }
})

export default router
