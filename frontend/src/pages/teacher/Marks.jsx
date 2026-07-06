import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Save, PlusCircle, Sparkles } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }
const CLASSES   = ['1','2','3','4','5','6','7','8','9','10','11','12']
const SUBJECTS  = ['Mathematics','Science','English','Hindi','Social Science','Physics','Chemistry','Biology','Accountancy','Economics','Business Studies','Computer Science']
const EXAM_TYPES = ['Unit Test 1', 'Unit Test 2', 'Half-Yearly', 'Annual', 'Pre-Board']

export default function TeacherMarks() {
  const [students, setStudents] = useState([])
  const [marksData, setMarksData] = useState({}) // { studentId: marks }
  const [filter, setFilter] = useState({ class: '', subject: '', exam_type: 'Half-Yearly' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [aiStudent, setAiStudent] = useState(null)
  const [aiRemark, setAiRemark] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const loadStudents = async () => {
    if (!filter.class) return
    setLoading(true)
    try {
      const { data } = await api.get(`/students?class=${filter.class}`)
      setStudents(data)
      // Pre-fill existing marks
      if (filter.subject && filter.exam_type) {
        const marksRes = await api.get(`/marks?class=${filter.class}&subject=${encodeURIComponent(filter.subject)}&exam_type=${encodeURIComponent(filter.exam_type)}`)
        const filled = {}
        marksRes.data.forEach(m => { filled[m.student_id] = { marks: m.marks, max_marks: m.max_marks, id: m.id } })
        setMarksData(filled)
      }
    } catch { toast.error('Failed to load students') }
    finally { setLoading(false) }
  }

  useEffect(() => { if (filter.class) loadStudents() }, [filter.class])

  const handleSave = async () => {
    if (!filter.class || !filter.subject || !filter.exam_type) return toast.error('Select class, subject, and exam type first')
    setSaving(true)
    try {
      const promises = students.map(s => {
        const m = marksData[s.id]
        if (m?.marks === undefined || m?.marks === '') return null
        return api.post('/marks', {
          student_id: s.id,
          subject: filter.subject,
          exam_type: filter.exam_type,
          marks: parseFloat(m.marks),
          max_marks: parseFloat(m.max_marks || 100),
        })
      }).filter(Boolean)
      await Promise.all(promises)
      toast.success(`Marks saved for ${promises.length} students!`)
    } catch { toast.error('Failed to save marks') }
    finally { setSaving(false) }
  }

  const generateRemark = async (s) => {
    if (!marksData[s.id]?.marks) return toast.error('Enter marks first to generate remark')
    setAiStudent(s); setAiRemark(''); setAiLoading(true)
    try {
      const { data } = await api.post('/ai/remark', {
        studentData: {
          name: s.name, class: s.class, section: s.section,
          subject: filter.subject, exam_type: filter.exam_type,
          marks: marksData[s.id]?.marks, max_marks: marksData[s.id]?.max_marks || 100,
        }
      })
      setAiRemark(data.remark)
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI remark generation failed')
    } finally { setAiLoading(false) }
  }

  return (
    <>
      <Helmet><title>Enter Marks – Teacher – SMD Vidya Mandir</title></Helmet>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy, marginBottom: '1.5rem' }}>Enter Marks</h1>

      {/* Filters */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, color: C.navy, marginBottom: 16, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Filters</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Class *</label>
            <select value={filter.class} onChange={e => { setFilter({ ...filter, class: e.target.value }); setStudents([]) }}
              style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', background: C.white }}>
              <option value="">Select class</option>
              {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Subject *</label>
            <select value={filter.subject} onChange={e => setFilter({ ...filter, subject: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', background: C.white }}>
              <option value="">Select subject</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Exam Type *</label>
            <select value={filter.exam_type} onChange={e => setFilter({ ...filter, exam_type: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', background: C.white }}>
              {EXAM_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={loadStudents} disabled={!filter.class} style={{
              width: '100%', background: C.navy, color: C.white, fontWeight: 700,
              fontSize: 14, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer',
            }}>
              Load Students
            </button>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      {students.length > 0 && (
        <>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 700, color: C.navy, fontSize: '0.95rem' }}>
                Class {filter.class} - {filter.subject} - {filter.exam_type}
              </h2>
              <span style={{ fontSize: 13, color: C.muted }}>{students.length} students</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  {['Roll No', 'Student Name', 'Marks Obtained', 'Max Marks', 'Percentage', 'AI Remark'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const m = marksData[s.id] || {}
                  const pct = m.marks && m.max_marks ? Math.round((m.marks / m.max_marks) * 100) : null
                  const pctColor = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'
                  return (
                    <tr key={s.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : '#fafbff' }}>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: C.navy }}>{s.roll_number}</td>
                      <td style={{ padding: '10px 16px', fontWeight: 500 }}>{s.name}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <input type="number" min={0} max={m.max_marks || 100}
                          value={m.marks ?? ''} onChange={e => setMarksData({ ...marksData, [s.id]: { ...m, marks: e.target.value } })}
                          placeholder="0"
                          style={{ width: 80, padding: '6px 10px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: 'none', textAlign: 'center' }} />
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <input type="number" min={1}
                          value={m.max_marks ?? 100} onChange={e => setMarksData({ ...marksData, [s.id]: { ...m, max_marks: e.target.value } })}
                          style={{ width: 80, padding: '6px 10px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: 'none', textAlign: 'center' }} />
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        {pct !== null ? <span style={{ fontWeight: 700, color: pctColor }}>{pct}%</span> : <span style={{ color: C.muted }}>-</span>}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <button onClick={() => generateRemark(s)} style={{
                          background: '#f5f3ff', color: '#8b5cf6', border: 'none', borderRadius: 8,
                          padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          <Sparkles size={13} /> AI
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <button onClick={handleSave} disabled={saving} style={{
            background: C.gold, color: C.navy, fontWeight: 800, fontSize: 15,
            padding: '13px 32px', borderRadius: 12, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Save size={16} /> {saving ? 'Saving Marks...' : 'Save All Marks'}
          </button>
        </>
      )}

      {loading && <p style={{ textAlign: 'center', color: C.muted, padding: 40 }}>Loading students...</p>}
      {!loading && !filter.class && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 48, textAlign: 'center', color: C.muted }}>
          <PlusCircle size={40} color={C.border} style={{ marginBottom: 12 }} />
          <p>Select a class, subject, and exam type above to load the marks entry table.</p>
        </div>
      )}

      {/* AI Remark Modal */}
      {aiStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: C.white, borderRadius: 20, padding: 32, maxWidth: 480, width: '90%' }}>
            <h3 style={{ fontWeight: 700, color: C.navy, marginBottom: 8 }}>AI Remark for {aiStudent.name}</h3>
            {aiLoading
              ? <div style={{ textAlign: 'center', padding: 24, color: C.muted }}>✨ Generating remark...</div>
              : <div style={{ background: '#f5f3ff', borderRadius: 12, padding: 16, color: '#5b21b6', lineHeight: 1.7, fontSize: 14, marginBottom: 16 }}>{aiRemark}</div>
            }
            <button onClick={() => { setAiStudent(null); setAiRemark('') }} style={{ padding: '10px 24px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
