import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Calendar, Save, CheckCircle } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }
const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12']
const STATUS_OPTS = ['present','absent','late']
const STATUS_COLORS = { present: '#10b981', absent: '#ef4444', late: '#f59e0b' }
const STATUS_BG = { present: '#ecfdf5', absent: '#fef2f2', late: '#fff8ed' }

export default function TeacherAttendance() {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({}) // { studentId: 'present'|'absent'|'late' }
  const [filter, setFilter] = useState({ class: '', date: new Date().toISOString().slice(0, 10) })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const loadStudents = async () => {
    if (!filter.class) return
    setLoading(true)
    try {
      const [studRes, attRes] = await Promise.all([
        api.get(`/students?class=${filter.class}`),
        api.get(`/attendance?class=${filter.class}&date=${filter.date}`),
      ])
      setStudents(studRes.data)
      // Pre-fill existing attendance
      const existing = {}
      attRes.data.forEach(a => { existing[a.student_id] = a.status })
      // Default all to 'present' if not yet marked
      studRes.data.forEach(s => { if (!existing[s.id]) existing[s.id] = 'present' })
      setAttendance(existing)
      setSaved(false)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const markAll = (status) => {
    const all = {}
    students.forEach(s => { all[s.id] = status })
    setAttendance(all)
  }

  const handleSave = async () => {
    if (!filter.class || students.length === 0) return toast.error('Load students first')
    setSaving(true)
    try {
      const records = students.map(s => ({
        student_id: s.id,
        date: filter.date,
        status: attendance[s.id] || 'present',
      }))
      await api.post('/attendance', { records })
      toast.success('Attendance saved!')
      setSaved(true)
    } catch { toast.error('Failed to save attendance') }
    finally { setSaving(false) }
  }

  const counts = {
    present: students.filter(s => attendance[s.id] === 'present').length,
    absent:  students.filter(s => attendance[s.id] === 'absent').length,
    late:    students.filter(s => attendance[s.id] === 'late').length,
  }

  return (
    <>
      <Helmet><title>Attendance – Teacher – SMD Digital Campus</title></Helmet>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy, marginBottom: '1.5rem' }}>Mark Attendance</h1>

      {/* Filters */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Class *</label>
            <select value={filter.class} onChange={e => setFilter({ ...filter, class: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', background: C.white }}>
              <option value="">Select class</option>
              {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Date *</label>
            <input type="date" value={filter.date} onChange={e => setFilter({ ...filter, date: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={loadStudents} disabled={!filter.class} style={{
              width: '100%', background: C.navy, color: C.white, fontWeight: 700,
              fontSize: 14, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer',
            }}>
              <Calendar size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Load
            </button>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      {students.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {Object.entries(counts).map(([s, v]) => (
            <div key={s} style={{ background: STATUS_BG[s], borderRadius: 10, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[s], display: 'inline-block' }} />
              <span style={{ fontWeight: 700, color: STATUS_COLORS[s] }}>{v}</span>
              <span style={{ fontSize: 13, color: C.muted, textTransform: 'capitalize' }}>{s}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {STATUS_OPTS.map(s => (
              <button key={s} onClick={() => markAll(s)} style={{
                padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${STATUS_COLORS[s]}`,
                background: 'transparent', color: STATUS_COLORS[s], fontWeight: 600, fontSize: 12,
                cursor: 'pointer', textTransform: 'capitalize',
              }}>
                All {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attendance grid */}
      {loading ? (
        <p style={{ textAlign: 'center', color: C.muted, padding: 40 }}>Loading students...</p>
      ) : students.length > 0 ? (
        <>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  {['#', 'Roll No', 'Student Name', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const status = attendance[s.id] || 'present'
                  return (
                    <tr key={s.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : '#fafbff' }}>
                      <td style={{ padding: '10px 16px', color: C.muted }}>{i + 1}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: C.navy }}>{s.roll_number}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 500 }}>{s.name}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {STATUS_OPTS.map(opt => (
                            <button key={opt} onClick={() => setAttendance({ ...attendance, [s.id]: opt })} style={{
                              padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${status === opt ? STATUS_COLORS[opt] : C.border}`,
                              background: status === opt ? STATUS_BG[opt] : 'transparent',
                              color: status === opt ? STATUS_COLORS[opt] : C.muted,
                              fontWeight: 600, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize',
                              transition: 'all 0.15s',
                            }}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <button onClick={handleSave} disabled={saving} style={{
            background: saved ? '#10b981' : C.gold, color: saved ? C.white : C.navy,
            fontWeight: 800, fontSize: 15, padding: '13px 32px', borderRadius: 12,
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {saved ? <><CheckCircle size={16} /> Attendance Saved!</> : <><Save size={16} /> {saving ? 'Saving...' : 'Save Attendance'}</>}
          </button>
        </>
      ) : !filter.class ? (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 48, textAlign: 'center', color: C.muted }}>
          Select a class and date above to mark attendance.
        </div>
      ) : null}
    </>
  )
}
