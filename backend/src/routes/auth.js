import express from 'express'
import bcrypt  from 'bcryptjs'
import jwt     from 'jsonwebtoken'
import pool    from '../config/db.js'
import { protect } from '../middleware/auth.js'
import { sendEmail } from '../utils/mailer.js'

const router = express.Router()

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      // Don't leak whether the email exists or not
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = jwt.sign(
      { id: user.id, type: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const resetLink = `${process.env.FRONTEND_URL || 'https://smd-vidya-mandir-web.vercel.app'}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'SMD Vidya Mandir - Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>We received a request to reset the password for your Admin account.</p>
        <p>Click the link below to set a new password. This link is valid for 15 minutes.</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#0a143c;color:#fff;text-decoration:none;border-radius:5px;margin:15px 0;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ message: 'Server error while sending reset email' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid or expired reset token' });
    }

    if (decoded.type !== 'reset') {
      return res.status(401).json({ message: 'Invalid token type' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, decoded.id]);

    res.json({ message: 'Password has been successfully reset' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ message: 'Server error while resetting password' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const { rows: users } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = users[0]

    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ message: 'Invalid email or password' })

    const { rows: settings } = await pool.query('SELECT require_2fa FROM site_settings LIMIT 1')
    const require2FA = settings[0]?.require_2fa

    if (require2FA) {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const hashedOtp = await bcrypt.hash(otp, 10)

      const tempToken = jwt.sign(
        { id: user.id, role: user.role, name: user.name, email: user.email, otp: hashedOtp, type: '2fa' },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      )

      await sendEmail({
        to: user.email,
        subject: 'SMD Vidya Mandir - Admin Login Verification Code',
        html: `
          <h2>Login Verification</h2>
          <p>Hello ${user.name},</p>
          <p>Please use the following 6-digit verification code to complete your login:</p>
          <h1 style="letter-spacing: 5px; background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center; color: #0a143c;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        `
      })

      return res.json({ requiresOtp: true, tempToken, message: 'OTP sent to your email.' })
    }

    // Normal Login
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { tempToken, otp } = req.body
    
    if (!tempToken || !otp) {
      return res.status(400).json({ message: 'Missing token or OTP' })
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET)
    } catch (e) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    if (decoded.type !== '2fa') {
      return res.status(401).json({ message: 'Invalid token type' })
    }

    const isValid = await bcrypt.compare(otp, decoded.otp)
    if (!isValid) {
      return res.status(401).json({ message: 'Incorrect verification code' })
    }

    const token = jwt.sign(
      { id: decoded.id, role: decoded.role, name: decoded.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    res.json({ 
      token, 
      user: { id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role } 
    })
  } catch (err) {
    console.error('Verify OTP error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/auth/me — returns current user info
router.get('/me', protect, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    if (!rows[0]) return res.status(404).json({ message: 'User not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/auth/register — admin can create users
router.post('/register', protect, async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Admin only' })

    const hash = await bcrypt.hash(password, 10)
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, hash, role, phone || null]
    )
    res.status(201).json({ message: 'User created', id: rows[0].id })
  } catch (err) {
    if (err.code === '23505') // Postgres unique_violation
      return res.status(400).json({ message: 'Email already exists' })
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
