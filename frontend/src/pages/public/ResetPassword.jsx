import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../../assets/images/logo.webp'
import toast from 'react-hot-toast'
import api from '@/services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [focused, setFocused] = useState('')

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token.')
      navigate('/login')
    }
  }, [token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirm) {
      return toast.error('Passwords do not match!')
    }
    
    setLoading(true)
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword: password })
      toast.success(res.data.message || 'Password reset successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Token may be expired.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (name) => ({
    width: '100%', padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
    border: `1.5px solid ${focused === name ? '#0a143c' : '#e5e7eb'}`,
    borderRadius: 10, background: '#fff', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  })

  return (
    <>
      <Helmet>
        <title>Reset Password – SMD Vidya Mandir</title>
        <meta name="description" content="Set a new password for your admin account." />
      </Helmet>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a143c 0%, #1a3aad 50%, #0a143c 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingTop: '120px', paddingBottom: '40px', paddingLeft: '20px', paddingRight: '20px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 400, height: 400, borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
        
        <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
          <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <img src={logo} alt="SMD Logo" style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 16px' }} />
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0a143c' }}>Set New Password</h1>
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Please enter your new password below.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'} required placeholder="••••••••" minLength="6"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    style={{ ...inputStyle('password'), paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4,
                  }}>
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'} required placeholder="••••••••" minLength="6"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused('')}
                    style={{ ...inputStyle('confirm'), paddingRight: 44 }}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #0a143c, #1a3aad)',
                color: '#fff', fontWeight: 800, fontSize: 15, padding: '14px',
                borderRadius: 12, border: 'none', cursor: loading ? 'wait' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(10,20,60,0.3)',
                transition: 'all 0.2s',
              }}>
                {loading ? 'Saving...' : 'Reset Password'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b7280' }}>
              <Link to="/login" style={{ color: '#0a143c', fontWeight: 600, textDecoration: 'none' }}>← Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
