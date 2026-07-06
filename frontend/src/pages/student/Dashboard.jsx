import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { TrendingUp, Calendar, Award, BookOpen } from 'lucide-react'
import api from '@/services/api'
import { useAuth } from '@/context/AuthContext'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }

export default function StudentDashboard() {
  const { user } = useAuth()
  const [marks, setMarks]     = useState([])
  const [attData, setAttData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/marks/my'),
      api.get('/attendance/my'),
    ]).then(([m, a]) => {
      setMarks(m.data)
      setAttData(a.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const recentMarks = marks.slice(0, 4)
  const avgPct = marks.length
    ? Math.round(marks.reduce((sum, m) => sum + (m.marks / m.max_marks * 100), 0) / marks.length)
    : 0
  const attPct = attData?.summary?.percentage ?? 0
  const attColor = attPct >= 75 ? '#10b981' : attPct >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <>
      <Helmet><title>Student Dashboard – SMD Vidya Mandir</title></Helmet>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy }}>Welcome, {user?.name}! 🎓</h1>
        <p style={{ color: C.muted, marginTop: 4 }}>Here's your academic overview.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0a143c, #1a3aad)', borderRadius: 16, padding: '24px 20px', color: C.white }}>
          <TrendingUp size={28} color={C.gold} />
          <p style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8, lineHeight: 1 }}>{loading ? '...' : `${avgPct}%`}</p>
          <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>Average Score</p>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${attColor}22, ${attColor}11)`, border: `1px solid ${attColor}33`, borderRadius: 16, padding: '24px 20px' }}>
          <Calendar size={28} color={attColor} />
          <p style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8, color: attColor, lineHeight: 1 }}>{loading ? '...' : `${attPct}%`}</p>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Attendance</p>
          {attPct < 75 && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 600 }}>⚠ Below 75% - attend more classes</p>}
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px 20px' }}>
          <Award size={28} color={C.gold} />
          <p style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8, color: C.navy, lineHeight: 1 }}>{loading ? '...' : marks.length}</p>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Subjects Assessed</p>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px 20px' }}>
          <BookOpen size={28} color='#8b5cf6' />
          <p style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: 8, color: C.navy, lineHeight: 1 }}>
            {loading ? '...' : attData?.summary?.present ?? 0}
          </p>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Days Present</p>
        </div>
      </div>

      {/* Recent Marks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontWeight: 700, color: C.navy, marginBottom: 16, fontSize: '1rem' }}>Recent Marks</h2>
          {loading ? <p style={{ color: C.muted }}>Loading...</p>
            : recentMarks.length === 0
              ? <p style={{ color: C.muted }}>No marks recorded yet.</p>
              : recentMarks.map((m, i) => {
                const pct = Math.round((m.marks / m.max_marks) * 100)
                const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <p style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{m.subject}</p>
                      <p style={{ fontSize: 12, color: C.muted }}>{m.exam_type}</p>
                    </div>
                    <span style={{ fontWeight: 800, color, fontSize: '1.1rem' }}>{m.marks}/{m.max_marks}</span>
                  </div>
                )
              })
          }
          <a href="/student/results" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: C.navy, fontWeight: 600 }}>
            View All Results →
          </a>
        </div>

        {/* Attendance Summary */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontWeight: 700, color: C.navy, marginBottom: 16, fontSize: '1rem' }}>Attendance Summary</h2>
          {loading ? <p style={{ color: C.muted }}>Loading...</p>
            : !attData
              ? <p style={{ color: C.muted }}>No attendance data.</p>
              : (
                <>
                  {[
                    { label: 'Present', val: attData.summary.present, color: '#10b981', bg: '#ecfdf5' },
                    { label: 'Absent',  val: attData.summary.absent,  color: '#ef4444', bg: '#fef2f2' },
                    { label: 'Late',    val: attData.summary.late,    color: '#f59e0b', bg: '#fff8ed' },
                    { label: 'Total',   val: attData.summary.total,   color: C.navy,   bg: C.bg },
                  ].map(({ label, val, color, bg }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, marginBottom: 8, background: bg }}>
                      <span style={{ fontSize: 14, color: C.text }}>{label}</span>
                      <span style={{ fontWeight: 800, color, fontSize: '1.1rem' }}>{val} days</span>
                    </div>
                  ))}
                  <a href="/student/attendance" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: C.navy, fontWeight: 600 }}>
                    View Calendar →
                  </a>
                </>
              )
          }
        </div>
      </div>
    </>
  )
}
