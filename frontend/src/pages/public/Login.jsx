import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '@/context/AuthContext'
import { GraduationCap, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const DEMO = [
  { role: 'Admin',   email: 'admin@smdschool.in',   pw: 'admin123' },
  { role: 'Teacher', email: 'teacher@smdschool.in', pw: 'admin123' },
  { role: 'Student', email: 'student@smdschool.in', pw: 'admin123' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [focused, setFocused] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(`/${user.role}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Check email & password.')
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
        <meta name="description" content="Login to SMD Vidya Mandir portal - admin, teacher, student, parent access." />
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
              <div style={{
                width: 72, height: 72, background: 'linear-gradient(135deg, #0a143c, #1a3aad)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(10,20,60,0.3)',
              }}>
                <GraduationCap size={34} color="#f59e0b" />
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0a143c' }}>SMD Vidya Mandir</h1>
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Sign in to access your portal</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Email Address
                </label>
                <input
                  type="email" required placeholder="you@smdschool.in"
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

              <button type="submit" disabled={loading} style={{
                width: '100%', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #0a143c, #1a3aad)',
                color: '#fff', fontWeight: 800, fontSize: 15, padding: '14px',
                borderRadius: 12, border: 'none', cursor: loading ? 'wait' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(10,20,60,0.3)',
                transition: 'all 0.2s',
              }}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            {/* Demo accounts */}
            <div style={{ marginTop: 28, padding: '16px', background: '#f7f9ff', borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <AlertCircle size={14} color="#f59e0b" />
                <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Accounts (DB must be running)</p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {DEMO.map(d => (
                  <button key={d.role} onClick={() => fillDemo(d)} style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                    border: '1.5px solid #e5e7eb', background: '#fff', color: '#0a143c', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.target.style.borderColor = '#0a143c'; e.target.style.background = '#0a143c'; e.target.style.color = '#f59e0b' }}
                    onMouseLeave={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#fff'; e.target.style.color = '#0a143c' }}
                  >
                    {d.role}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
                Click a role to auto-fill, then press Sign In.
              </p>
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
