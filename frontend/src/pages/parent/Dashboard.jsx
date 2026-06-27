import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Users, Calendar, TrendingUp, Bell } from 'lucide-react'
import api from '@/services/api'
import { useAuth } from '@/context/AuthContext'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }

export default function ParentDashboard() {
  const { user } = useAuth()
  const [marks, setMarks]     = useState([])
  const [attData, setAttData] = useState(null)
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Parent dashboard shows child data — for now show notices + upcoming features
    Promise.all([
      api.get('/notices'),
    ]).then(([n]) => {
      setNotices(n.data.slice(0, 4))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet><title>Parent Dashboard – SMD Digital Campus</title></Helmet>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy }}>Welcome, {user?.name}! 👨‍👩‍👧</h1>
        <p style={{ color: C.muted, marginTop: 4 }}>Stay updated on your child's academic progress.</p>
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: "Child's Progress", desc: 'Academic performance tracking', icon: TrendingUp, color: '#3b82f6', bg: '#eff6ff', status: 'Coming Soon' },
          { label: "Attendance",       desc: "View your child's attendance", icon: Calendar,   color: '#10b981', bg: '#ecfdf5', status: 'Coming Soon' },
          { label: "Fee Status",       desc: 'Fee payment history',          icon: Users,      color: '#8b5cf6', bg: '#f5f3ff', status: 'Coming Soon' },
        ].map(({ label, desc, icon: Icon, color, bg, status }) => (
          <div key={label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ background: bg, borderRadius: 12, padding: 10 }}>
                <Icon size={22} color={color} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, background: '#f3f4f6', color: C.muted, padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {status}
              </span>
            </div>
            <h3 style={{ fontWeight: 700, color: C.navy, fontSize: '0.95rem', marginBottom: 4 }}>{label}</h3>
            <p style={{ fontSize: 13, color: C.muted }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* School Notices */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Bell size={18} color={C.navy} />
          <h2 style={{ fontWeight: 700, color: C.navy, fontSize: '1rem' }}>School Notices</h2>
        </div>
        {loading ? <p style={{ color: C.muted }}>Loading...</p>
          : notices.length === 0 ? <p style={{ color: C.muted }}>No notices at the moment.</p>
          : notices.map(n => (
            <div key={n.id} style={{ padding: '14px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold, flexShrink: 0, marginTop: 5 }} />
                <div>
                  <p style={{ fontWeight: 600, color: C.text, fontSize: 14, marginBottom: 4 }}>{n.title}</p>
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>
                    {n.content.length > 150 ? n.content.slice(0, 150) + '...' : n.content}
                  </p>
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
                    {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {/* Contact School */}
      <div style={{ marginTop: '1.5rem', background: 'linear-gradient(110deg, #0a143c, #1a3aad)', borderRadius: 16, padding: '24px', color: C.white }}>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Need to reach us?</h3>
        <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 16 }}>
          Contact SMD School directly for any queries about your child.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="tel:+919001995272" style={{ background: C.gold, color: C.navy, fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
            📞 +91-9001995272
          </a>
          <a href="mailto:smdvidyamandir@gmail.com" style={{ border: '1.5px solid rgba(255,255,255,0.3)', color: C.white, fontWeight: 600, fontSize: 14, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
            ✉ smdvidyamandir@gmail.com
          </a>
        </div>
      </div>
    </>
  )
}
