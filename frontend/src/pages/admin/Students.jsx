import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { UserPlus, Search, Edit2, Trash2, X, Check, FileSpreadsheet } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'
import Papa from 'papaparse'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }

const EMPTY_FORM = { name: '', email: '', phone: '', roll_number: '', class: '', section: 'A', password: 'student123' }
const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12']

export default function AdminStudents() {
  const [students, setStudents]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [filterClass, setFilter]  = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]       = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [deleteId, setDeleteId]   = useState(null)

  const load = async () => {
    try {
      const params = filterClass ? `?class=${filterClass}` : ''
      const { data } = await api.get(`/students${params}`)
      setStudents(data)
    } catch { toast.error('Failed to load students') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filterClass])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number?.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true) }
  const openEdit = (s) => {
    setForm({ name: s.name, email: s.email, phone: s.phone || '', roll_number: s.roll_number, class: s.class, section: s.section || 'A', password: '' })
    setEditId(s.id); setShowModal(true)
  }

  const handleBulkUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setSaving(true)
        const loadingToast = toast.loading('Uploading students...')
        try {
          const res = await api.post('/students/bulk', { students: results.data })
          toast.success(res.data.message || 'Bulk upload successful', { id: loadingToast })
          load()
        } catch (err) {
          toast.error(err.response?.data?.message || 'Bulk upload failed', { id: loadingToast })
        } finally {
          setSaving(false)
          e.target.value = null // reset input
        }
      }
    })
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editId) {
        await api.put(`/students/${editId}`, form)
        toast.success('Student updated!')
      } else {
        await api.post('/students', form)
        toast.success('Student added!')
      }
      setShowModal(false); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving student')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`)
      toast.success('Student removed'); setDeleteId(null); load()
    } catch { toast.error('Delete failed') }
  }

  return (
    <>
      <Helmet><title>Students – Admin – SMD Vidya Mandir</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy }}>Students</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="file" id="csv-upload" accept=".csv" style={{ display: 'none' }} onChange={handleBulkUpload} />
          <button onClick={() => document.getElementById('csv-upload').click()} style={{
            background: C.white, color: C.navy, fontWeight: 600, fontSize: 14,
            padding: '10px 16px', borderRadius: 10, border: `1.5px solid ${C.border}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <FileSpreadsheet size={16} /> Bulk Import CSV
          </button>
          <button onClick={openAdd} style={{
            background: C.gold, color: C.navy, fontWeight: 700, fontSize: 14,
            padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <UserPlus size={16} /> Add Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
          <input
            placeholder="Search by name or roll no..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={filterClass} onChange={e => setFilter(e.target.value)}
          style={{ padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', background: C.white }}>
          <option value="">All Classes</option>
          {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {['Roll No', 'Name', 'Class', 'Email', 'Phone', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: C.muted }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: C.muted }}>No students found.</td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : '#fafbff' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: C.navy }}>{s.roll_number}</td>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '12px 16px' }}>Class {s.class}{s.section && `-${s.section}`}</td>
                <td style={{ padding: '12px 16px', color: C.muted }}>{s.email}</td>
                <td style={{ padding: '12px 16px', color: C.muted }}>{s.phone || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(s)} style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteId(s.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: C.white, borderRadius: 16, padding: 32, maxWidth: 380, width: '90%' }}>
            <h3 style={{ color: C.navy, fontWeight: 700, marginBottom: 12 }}>Delete Student?</h3>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>This will permanently delete the student and all their data. This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: '10px 20px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#ef4444', color: C.white, cursor: 'pointer', fontWeight: 700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: C.white, borderRadius: 20, padding: '32px', maxWidth: 520, width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, color: C.navy, fontSize: '1.2rem' }}>{editId ? 'Edit Student' : 'Add New Student'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} color={C.muted} /></button>
            </div>
            <form onSubmit={handleSave}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', required: true },
                { label: 'Email', key: 'email', type: 'email', required: !editId },
                { label: 'Phone', key: 'phone', type: 'tel' },
                { label: 'Roll Number', key: 'roll_number', type: 'text', required: true },
              ].map(({ label, key, type, required }) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}{required && ' *'}</label>
                  <input type={type} required={required} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Class *</label>
                  <select required value={form.class} onChange={e => setForm({ ...form, class: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', background: C.white }}>
                    <option value="">Select</option>
                    {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Section</label>
                  <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', background: C.white }}>
                    {['A','B','C','D'].map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
              </div>
              {!editId && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Default Password</label>
                  <input type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Student will use this to login. Share it securely.</p>
                </div>
              )}
              <button type="submit" disabled={saving} style={{
                width: '100%', background: C.navy, color: C.white, fontWeight: 700,
                fontSize: 15, padding: '13px', borderRadius: 10, border: 'none', cursor: saving ? 'wait' : 'pointer',
              }}>
                {saving ? 'Saving...' : editId ? 'Update Student' : 'Add Student'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
