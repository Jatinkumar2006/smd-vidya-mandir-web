import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ImagePlus, Trash2, X } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }
const CATEGORIES = ['general', 'events', 'sports', 'cultural', 'campus', 'academic']
const PLACEHOLDER_COLORS = ['#0a143c', '#1a3aad', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#3b82f6', '#f97316']

export default function AdminGallery() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [filterCat, setFilter]    = useState('all')
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState({ title: '', category: 'general' })
  const [files, setFiles]         = useState([])
  const [saving, setSaving]       = useState(false)
  const [preview, setPreview]     = useState(null)

  const load = async () => {
    try {
      const { data } = await api.get('/gallery')
      setItems(data)
    } catch { toast.error('Failed to load gallery') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = filterCat === 'all' ? items : items.filter(i => i.category === filterCat)

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('category', form.category)
      files.forEach(f => formData.append('images', f))

      await api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Gallery items added!')
      setForm({ title: '', category: 'general' }); setFiles([]); setShowForm(false); load()
    } catch { toast.error('Failed to add item') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`)
      toast.success('Item removed'); load()
    } catch { toast.error('Delete failed') }
  }

  return (
    <>
      <Helmet><title>Gallery – Admin – SMD Vidya Mandir</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy }}>Gallery Management</h1>
        <button onClick={() => setShowForm(true)} style={{
          background: C.gold, color: C.navy, fontWeight: 700, fontSize: 14,
          padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <ImagePlus size={16} /> Add Item
        </button>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['all', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '7px 16px', borderRadius: 8, border: `1.5px solid ${filterCat === cat ? C.navy : C.border}`,
            background: filterCat === cat ? C.navy : C.white, color: filterCat === cat ? C.white : C.muted,
            fontWeight: 600, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {cat === 'all' ? `All (${items.length})` : `${cat} (${items.filter(i => i.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, color: C.navy }}>Add Gallery Item</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} color={C.muted} /></button>
          </div>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Event Name / Title *</label>
                <input required value={form.title} placeholder="e.g. Annual Day 2025" onChange={e => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', background: C.white }}>
                  {CATEGORIES.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Upload Images (Select Multiple) *</label>
              <input required multiple type="file" accept="image/*" onChange={e => setFiles(Array.from(e.target.files))}
                style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>You can select multiple .jpg or .png files at once.</p>
            </div>
            <button type="submit" disabled={saving} style={{
              background: C.navy, color: C.white, fontWeight: 700, fontSize: 14,
              padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
            }}>
              {saving ? 'Adding...' : 'Add to Gallery'}
            </button>
          </form>
        </div>
      )}

      {/* Grid */}
      {loading
        ? <p style={{ textAlign: 'center', color: C.muted, padding: 48 }}>Loading...</p>
        : filtered.length === 0
          ? <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 48, textAlign: 'center', color: C.muted }}>No gallery items found. Add some above!</div>
          : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {filtered.map((item, i) => (
                <div key={item.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.title} style={{ width: '100%', height: 160, objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                    : null
                  }
                  <div style={{ width: '100%', height: 160, background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length], display: item.image_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 40 }}>🖼️</span>
                  </div>
                  <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: C.text, fontSize: 13 }}>{item.title}</p>
                      <span style={{ fontSize: 11, color: C.muted, textTransform: 'capitalize' }}>{item.category}</span>
                    </div>
                    <button onClick={() => handleDelete(item.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
      }
    </>
  )
}
