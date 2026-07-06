import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { UserPlus, Search, Edit2, Trash2, X } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }

const EMPTY_FORM = { name: '', email: '', phone: '', password: 'teacher123' }

export default function AdminTeachers() {
  const [teachers, setTeachers]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]       = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [deleteId, setDeleteId]   = useState(null)

  const load = async () => {
    try {
      const { data } = await api.get('/teachers')
      setTeachers(data)
    } catch { toast.error('Failed to load teachers') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true) }
  const openEdit = (t) => {
    setForm({ name: t.name, email: t.email, phone: t.phone || '', password: '' })
    setEditId(t.id); setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editId) {
        await api.put(`/teachers/${editId}`, form)
        toast.success('Teacher updated!')
      } else {
        await api.post('/teachers', form)
        toast.success('Teacher added!')
      }
      setShowModal(false); load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving teacher')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/teachers/${id}`)
      toast.success('Teacher removed'); setDeleteId(null); load()
    } catch { toast.error('Delete failed') }
  }

  return (
    <>
      <Helmet><title>Teachers – Admin – SMD Vidya Mandir</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy }}>Teachers (Staff)</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={openAdd} style={{
            background: C.gold, color: C.navy, fontWeight: 700, fontSize: 14,
            padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <UserPlus size={16} /> Add Teacher
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
          <input
            placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: C.bg }}>
              {['Name', 'Email', 'Phone', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: C.muted }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: C.muted }}>No teachers found.</td></tr>
            ) : filtered.map((t, i) => (
              <tr key={t.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : '#fafbff' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: C.navy }}>{t.name}</td>
                <td style={{ padding: '12px 16px', color: C.muted }}>{t.email}</td>
                <td style={{ padding: '12px 16px', color: C.muted }}>{t.phone || '-'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(t)} style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteId(t.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
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
            <h3 style={{ color: C.navy, fontWeight: 700, marginBottom: 12 }}>Delete Teacher?</h3>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>This will permanently delete the teacher. This cannot be undone.</p>
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
          <div style={{ background: C.white, borderRadius: 20, padding: '32px', maxWidth: 420, width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, color: C.navy, fontSize: '1.2rem' }}>{editId ? 'Edit Teacher' : 'Add New Teacher'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} color={C.muted} /></button>
            </div>
            <form onSubmit={handleSave}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', required: true },
                { label: 'Email (Login ID)', key: 'email', type: 'email', required: !editId },
                { label: 'Phone', key: 'phone', type: 'tel' },
              ].map(({ label, key, type, required }) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{label}{required && ' *'}</label>
                  <input type={type} required={required} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{editId ? 'New Password (Optional)' : 'Password *'}</label>
                <input type="text" required={!editId} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editId ? "Leave blank to keep current" : ""}
                  style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Teacher will use this to login. Share it securely.</p>
              </div>

              <button type="submit" disabled={saving} style={{
                width: '100%', background: C.navy, color: C.white, fontWeight: 700,
                fontSize: 15, padding: '13px', borderRadius: 10, border: 'none', cursor: saving ? 'wait' : 'pointer',
              }}>
                {saving ? 'Saving...' : editId ? 'Update Teacher' : 'Add Teacher'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
