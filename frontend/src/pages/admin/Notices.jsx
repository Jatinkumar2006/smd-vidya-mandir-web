import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Trash2, Sparkles, X } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }

export default function AdminNotices() {
  const [notices, setNotices]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ title: '', content: '' })
  const [saving, setSaving]     = useState(false)
  const [aiTopic, setAiTopic]   = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const load = async () => {
    try {
      const { data } = await api.get('/notices')
      setNotices(data)
    } catch { toast.error('Failed to load notices') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await api.post('/notices', form)
      toast.success('Notice published!')
      setForm({ title: '', content: '' }); setShowForm(false); load()
    } catch { toast.error('Failed to create notice') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notices/${id}`)
      toast.success('Notice removed')
      load()
    } catch { toast.error('Delete failed') }
  }

  const generateWithAI = async () => {
    if (!aiTopic.trim()) return toast.error('Enter a topic first')
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/notice', { topic: aiTopic })
      // Try to extract title from first line
      const lines = data.notice.trim().split('\n').filter(l => l.trim())
      const titleLine = lines.find(l => l.toLowerCase().startsWith('subject:'))
      const title = titleLine ? titleLine.replace(/^subject:\s*/i, '').trim() : aiTopic
      setForm({ title, content: data.notice })
      setShowForm(true)
      toast.success('AI notice generated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed. Is the Groq API key set?')
    } finally { setAiLoading(false) }
  }

  return (
    <>
      <Helmet><title>Notices – Admin – SMD Digital Campus</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy }}>Notices</h1>
        <button onClick={() => { setForm({ title: '', content: '' }); setShowForm(true) }} style={{
          background: C.navy, color: C.white, fontWeight: 700, fontSize: 14,
          padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Plus size={16} /> New Notice
        </button>
      </div>

      {/* AI Notice Generator */}
      <div style={{ background: 'linear-gradient(110deg, #0a143c, #1a3aad)', borderRadius: 16, padding: '24px', marginBottom: '1.5rem', color: C.white }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Sparkles size={20} color={C.gold} />
          <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>AI Notice Generator</h2>
          <span style={{ background: C.gold, color: C.navy, fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20 }}>GROQ AI</span>
        </div>
        <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>Type a topic and let AI draft a professional school notice for you in seconds.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            placeholder="e.g. Annual Sports Day, Exam schedule, Parent-Teacher Meeting..."
            value={aiTopic} onChange={e => setAiTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generateWithAI()}
            style={{ flex: 1, padding: '11px 16px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: C.white, fontSize: 14, outline: 'none' }}
          />
          <button onClick={generateWithAI} disabled={aiLoading} style={{
            background: C.gold, color: C.navy, fontWeight: 800, fontSize: 14,
            padding: '11px 22px', borderRadius: 10, border: 'none', cursor: aiLoading ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
          }}>
            {aiLoading ? '✨ Generating...' : '✨ Generate'}
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, color: C.navy }}>New Notice</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} color={C.muted} /></button>
          </div>
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Title *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Content *</label>
              <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8}
                style={{ width: '100%', padding: '11px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, background: C.navy, color: C.white, fontWeight: 700, fontSize: 14, padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
                {saving ? 'Publishing...' : 'Publish Notice'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notices List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading
          ? <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>Loading...</p>
          : notices.length === 0
            ? <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 40, textAlign: 'center', color: C.muted }}>No notices yet. Create one above.</div>
            : notices.map(n => (
              <div key={n.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                      <h3 style={{ fontWeight: 700, color: C.navy, fontSize: '1rem' }}>{n.title}</h3>
                    </div>
                    <p style={{ color: C.body, fontSize: 13.5, lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 8 }}>
                      {n.content.length > 200 ? n.content.slice(0, 200) + '...' : n.content}
                    </p>
                    <p style={{ fontSize: 12, color: C.muted }}>
                      {new Date(n.created_at).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(n.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', flexShrink: 0 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
        }
      </div>
    </>
  )
}
