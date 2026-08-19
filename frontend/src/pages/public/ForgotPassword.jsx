import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import logo from '../../assets/images/logo.webp'
import toast from 'react-hot-toast'
import api from '@/services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      toast.success(res.data.message || 'Reset link sent!')
      setEmail('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
    border: `1.5px solid ${focused === 'email' ? '#0a143c' : '#e5e7eb'}`,
    borderRadius: 10, background: '#fff', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password – SMD Vidya Mandir</title>
        <meta name="description" content="Reset your SMD Vidya Mandir admin password." />
      </Helmet>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a143c 0%, #1a3aad 50%, #0a143c 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: '120px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 400, height: 400, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        
        <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <img src={logo} alt="SMD Logo" style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 16px' }} />
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0a143c' }}>Forgot Password</h1>
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Enter your email to receive a reset link.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Registered Email
                </label>
                <input
                  type="email" required placeholder="example@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  style={inputStyle}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #0a143c, #1a3aad)',
                color: '#fff', fontWeight: 800, fontSize: 15, padding: '14px',
                borderRadius: 12, border: 'none', cursor: loading ? 'wait' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(10,20,60,0.3)',
                transition: 'all 0.2s',
              }}>
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/login" style={{ color: '#0a143c', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
