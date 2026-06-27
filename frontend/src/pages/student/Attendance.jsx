import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import api from '@/services/api'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }
const S_COLOR = { present: '#10b981', absent: '#ef4444', late: '#f59e0b' }
const S_BG    = { present: '#ecfdf5', absent: '#fef2f2', late: '#fff8ed' }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function StudentAttendance() {
  const [attData, setAttData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/attendance/my').then(r => setAttData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const records    = attData?.records || []
  const summary    = attData?.summary || { present: 0, absent: 0, late: 0, total: 0, percentage: 0 }
  const pctColor   = summary.percentage >= 75 ? '#10b981' : summary.percentage >= 50 ? '#f59e0b' : '#ef4444'

  // Group by month
  const byMonth = records.reduce((acc, r) => {
    const d = new Date(r.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!acc[key]) acc[key] = { label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, records: [] }
    acc[key].records.push(r)
    return acc
  }, {})

  return (
    <>
      <Helmet><title>My Attendance – SMD Digital Campus</title></Helmet>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy, marginBottom: '1.5rem' }}>My Attendance</h1>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {/* Circular percentage */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gridColumn: 'span 1' }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: `conic-gradient(${pctColor} ${summary.percentage * 3.6}deg, #f3f4f6 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: pctColor }}>{summary.percentage}%</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>Attendance Rate</p>
          {summary.percentage < 75 && <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, marginTop: 4, textAlign: 'center' }}>⚠ Below 75%</p>}
        </div>
        {[
          { label: 'Days Present', value: summary.present, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Days Absent',  value: summary.absent,  color: '#ef4444', bg: '#fef2f2' },
          { label: 'Late Arrivals', value: summary.late,   color: '#f59e0b', bg: '#fff8ed' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${color}22`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</p>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Attendance Records by Month */}
      {loading ? (
        <p style={{ textAlign: 'center', color: C.muted, padding: 40 }}>Loading attendance records...</p>
      ) : records.length === 0 ? (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 48, textAlign: 'center', color: C.muted }}>
          No attendance records found. Your teacher will mark attendance daily.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.entries(byMonth).map(([key, { label, records: recs }]) => {
            const p = recs.filter(r => r.status === 'present').length
            const a = recs.filter(r => r.status === 'absent').length
            const l = recs.filter(r => r.status === 'late').length
            return (
              <div key={key} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.bg }}>
                  <h3 style={{ fontWeight: 700, color: C.navy }}>{label}</h3>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>✓ {p} Present</span>
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>✗ {a} Absent</span>
                    {l > 0 && <span style={{ color: '#f59e0b', fontWeight: 600 }}>⏰ {l} Late</span>}
                  </div>
                </div>
                <div style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {recs.map(r => {
                    const d = new Date(r.date)
                    return (
                      <div key={r.date} title={`${r.date} — ${r.status}`} style={{
                        width: 48, height: 48, borderRadius: 10,
                        background: S_BG[r.status], border: `1.5px solid ${S_COLOR[r.status]}33`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'default',
                      }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: S_COLOR[r.status] }}>{d.getDate()}</span>
                        <span style={{ fontSize: 9, color: S_COLOR[r.status], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {r.status === 'present' ? 'P' : r.status === 'absent' ? 'A' : 'L'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
