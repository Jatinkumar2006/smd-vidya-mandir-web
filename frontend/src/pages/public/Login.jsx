import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '@/context/AuthContext'
import { GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react'
import logo from '../../assets/images/logo.webp'
import logoImg from '@/assets/images/logo.webp'
import toast from 'react-hot-toast'

const DEMO = [
  { role: 'Admin',   email: 'admin@smdschool.in',   pw: 'admin123' },
]

export default function Login() {
  const { login, verifyOtp } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [focused, setFocused] = useState('')
  
  const [otpStep, setOtpStep] = useState(false)
  const [otp, setOtp]         = useState('')
  const [tempToken, setTempToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (otpStep) {
        // Step 2: Verify OTP
        const user = await verifyOtp(tempToken, otp)
        toast.success(`Welcome back, ${user.name}!`)
        navigate(`/${user.role}`)
      } else {
        // Step 1: Login
        const result = await login(form.email, form.password)
        if (result.requiresOtp) {
          setTempToken(result.tempToken)
          setOtpStep(true)
          toast.success(result.message || 'OTP sent to your email')
        } else {
          // Normal login (2FA disabled)
          toast.success(`Welcome back, ${result.name}!`)
          navigate(`/${result.role}`)
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials or OTP.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (d) => setForm({ email: d.email, password: d.pw })

  const inputStyle = (name) => ({
    width: '100%', padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
    border: `1.5px solid ${focused === name ? '#0a143c' : '#e5e7eb'}`,
    borderRadius: 10, background: '#fff', fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  })

  return (
    <>
      <Helmet>
        <title>Login – SMD Vidya Mandir</title>
        <meta name="description" content="Login to SMD Vidya Mandir Admin portal." />
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
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
          {/* Card */}
          <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <img 
                src={logo} 
                alt="SMD Logo" 
                style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 16px' }} 
              />
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0a143c' }}>SMD Vidya Mandir</h1>
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Sign in to the Admin portal</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {!otpStep ? (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Email Address
                    </label>
                    <input
                      type="email" required placeholder="example@gmail.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                      style={inputStyle('email')}
                    />
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPw ? 'text' : 'password'} required placeholder="••••••••"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
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
                </>
              ) : (
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Verification Code (OTP)
                  </label>
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>Please enter the 6-digit code sent to your email.</p>
                  <input
                    type="text" required placeholder="123456" maxLength="6"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    onFocus={() => setFocused('otp')}
                    onBlur={() => setFocused('')}
                    style={{ ...inputStyle('otp'), textAlign: 'center', letterSpacing: '0.25em', fontSize: 18, fontWeight: 'bold' }}
                  />
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #0a143c, #1a3aad)',
                color: '#fff', fontWeight: 800, fontSize: 15, padding: '14px',
                borderRadius: 12, border: 'none', cursor: loading ? 'wait' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(10,20,60,0.3)',
                transition: 'all 0.2s',
              }}>
                {loading ? 'Processing...' : (otpStep ? 'Verify & Enter →' : 'Sign In →')}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b7280' }}>
              <Link to="/" style={{ color: '#0a143c', fontWeight: 600, textDecoration: 'none' }}>← Back to website</Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            © 2024 SMD Vidya Mandir · Sikar, Rajasthan
          </p>
        </div>
      </div>
    </>
  )
}
