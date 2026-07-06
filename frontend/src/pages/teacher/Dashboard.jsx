import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { BookOpen, Users, CheckSquare, TrendingUp } from 'lucide-react'
import api from '@/services/api'
import { useAuth } from '@/context/AuthContext'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const classes = [...new Set(students.map(s => s.class))].sort((a, b) => Number(a) - Number(b))

  return (
    <>
      <Helmet><title>Teacher Dashboard – SMD Vidya Mandir</title></Helmet>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy }}>Welcome back, {user?.name} 👋</h1>
        <p style={{ color: C.muted, marginTop: 4 }}>Here's your teaching overview for today.</p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Students', value: loading ? '...' : students.length, icon: Users, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Classes', value: loading ? '...' : classes.length, icon: BookOpen, color: '#10b981', bg: '#ecfdf5' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: bg, borderRadius: 12, padding: 12 }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: C.navy, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '0.75rem', color: C.muted, marginTop: 4 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* My Classes */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, color: C.navy, marginBottom: 16, fontSize: '1rem' }}>My Classes</h2>
        {loading ? <p style={{ color: C.muted }}>Loading...</p> : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {classes.length === 0
              ? <p style={{ color: C.muted }}>No students assigned yet.</p>
              : classes.map(cls => (
                <div key={cls} style={{ background: '#eff6ff', borderRadius: 10, padding: '10px 18px', textAlign: 'center' }}>
                  <p style={{ fontWeight: 800, color: C.navy, fontSize: '1.1rem' }}>Class {cls}</p>
                  <p style={{ fontSize: 12, color: C.muted }}>
                    {students.filter(s => s.class === cls).length} students
                  </p>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Enter Marks', desc: 'Add subject-wise marks for students', icon: TrendingUp, link: '/teacher/marks', color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Mark Attendance', desc: 'Take daily attendance for your class', icon: CheckSquare, link: '/teacher/attendance', color: '#10b981', bg: '#ecfdf5' },
        ].map(({ label, desc, icon: Icon, link, color, bg }) => (
          <a key={label} href={link} style={{ textDecoration: 'none' }}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 20px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = color}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ background: bg, borderRadius: 12, padding: 12, width: 'fit-content', marginBottom: 12 }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontWeight: 700, color: C.navy, fontSize: '0.95rem', marginBottom: 4 }}>{label}</h3>
              <p style={{ fontSize: 13, color: C.muted }}>{desc}</p>
            </div>
          </a>
        ))}
      </div>
    </>
  )
}
