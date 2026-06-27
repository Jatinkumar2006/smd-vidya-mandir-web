import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import api from '@/services/api'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }

function Grade({ pct }) {
  if (pct >= 91) return <span style={{ color: '#10b981', fontWeight: 700 }}>A1</span>
  if (pct >= 81) return <span style={{ color: '#10b981', fontWeight: 700 }}>A2</span>
  if (pct >= 71) return <span style={{ color: '#3b82f6', fontWeight: 700 }}>B1</span>
  if (pct >= 61) return <span style={{ color: '#3b82f6', fontWeight: 700 }}>B2</span>
  if (pct >= 51) return <span style={{ color: '#f59e0b', fontWeight: 700 }}>C1</span>
  if (pct >= 41) return <span style={{ color: '#f59e0b', fontWeight: 700 }}>C2</span>
  if (pct >= 33) return <span style={{ color: '#ef4444', fontWeight: 700 }}>D</span>
  return <span style={{ color: '#ef4444', fontWeight: 700 }}>E</span>
}

export default function StudentResults() {
  const [marks, setMarks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [activeExam, setActiveExam] = useState('')

  useEffect(() => {
    api.get('/marks/my').then(r => {
      setMarks(r.data)
      if (r.data.length) setActiveExam(r.data[0].exam_type)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const examTypes = [...new Set(marks.map(m => m.exam_type))]
  const filtered = activeExam ? marks.filter(m => m.exam_type === activeExam) : marks

  const total    = filtered.reduce((s, m) => s + Number(m.marks), 0)
  const maxTotal = filtered.reduce((s, m) => s + Number(m.max_marks), 0)
  const avgPct   = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0

  return (
    <>
      <Helmet><title>My Results – SMD Digital Campus</title></Helmet>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy, marginBottom: '1.5rem' }}>My Results</h1>

      {/* Exam Type Tabs */}
      {examTypes.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {examTypes.map(e => (
            <button key={e} onClick={() => setActiveExam(e)} style={{
              padding: '8px 18px', borderRadius: 10, border: `1.5px solid ${activeExam === e ? C.navy : C.border}`,
              background: activeExam === e ? C.navy : C.white,
              color: activeExam === e ? C.white : C.muted,
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>{e}</button>
          ))}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: C.muted, padding: 40 }}>Loading your results...</p>
      ) : marks.length === 0 ? (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 48, textAlign: 'center', color: C.muted }}>
          No marks have been entered yet. Please check back after your exam results are published.
        </div>
      ) : (
        <>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Marks', value: `${total}/${maxTotal}` },
              { label: 'Percentage', value: `${avgPct}%` },
              { label: 'Grade', value: <Grade pct={avgPct} /> },
              { label: 'Subjects', value: filtered.length },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: C.navy }}>{value}</p>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Marks Table */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  {['Subject', 'Exam', 'Marks', 'Max', 'Percentage', 'Grade'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const pct = Math.round((m.marks / m.max_marks) * 100)
                  const barColor = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
                  return (
                    <tr key={m.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : '#fafbff' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{m.subject}</td>
                      <td style={{ padding: '12px 16px', color: C.muted }}>{m.exam_type}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: C.navy }}>{m.marks}</td>
                      <td style={{ padding: '12px 16px', color: C.muted }}>{m.max_marks}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontWeight: 700, color: barColor, minWidth: 36 }}>{pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}><Grade pct={pct} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
