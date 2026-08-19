import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Search, Edit2, Trash2, X, UploadCloud, FileImage, Loader2 } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }

const EMPTY_FORM = { student_name: '', year: new Date().getFullYear(), student_class: '', score: '', description: '' }

export default function AdminResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const [selectedYear, setSelectedYear] = useState(null)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [newYear, setNewYear] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/results')
      setResults(data)
    } catch { toast.error('Failed to load results') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const years = [...new Set(results.map(r => r.year))].sort((a, b) => b - a)

  const filtered = results.filter(r => {
    if (selectedYear && r.year !== selectedYear) return false;
    return r.student_name.toLowerCase().includes(search.toLowerCase()) || r.year.toString().includes(search)
  })

  const openAdd = () => { setForm({ ...EMPTY_FORM, year: selectedYear || new Date().getFullYear() }); setEditId(null); setSelectedFile(null); setShowModal(true) }
  const openEdit = (r) => {
    setForm({ student_name: r.student_name, year: r.year, student_class: r.class, score: r.score, description: r.description || '' })
    setEditId(r.id); setSelectedFile(null); setShowModal(true)
  }

  const handleAddFolder = (e) => {
    e.preventDefault()
    if (newYear && !isNaN(newYear)) {
      setSelectedYear(parseInt(newYear))
      setShowFolderModal(false)
      setNewYear('')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!editId && !selectedFile) return toast.error('Please select a student photo.')

    setSaving(true)
    const formData = new FormData()
    formData.append('student_name', form.student_name)
    formData.append('year', form.year)
    formData.append('student_class', form.student_class)
    formData.append('score', form.score)
    formData.append('description', form.description)
    if (selectedFile) formData.append('photo', selectedFile)

    try {
      if (editId) {
        await api.put(`/results/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Result updated!')
      } else {
        await api.post('/results', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Result added!')
      }
      setShowModal(false); load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving result')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/results/${id}`)
      toast.success('Result removed'); setDeleteId(null); load()
    } catch { toast.error('Delete failed') }
  }

  return (
    <>
      <Helmet><title>Top Results – Admin – SMD Vidya Mandir</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {selectedYear && (
            <button onClick={() => setSelectedYear(null)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontWeight: 600 }}>
              &larr; Back
            </button>
          )}
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy }}>{selectedYear ? `Results for ${selectedYear}` : 'Top Results Folders'}</h1>
        </div>
        
        <button onClick={selectedYear ? openAdd : () => setShowFolderModal(true)} style={{
          background: C.gold, color: C.navy, fontWeight: 700, fontSize: 14,
          padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Plus size={16} /> {selectedYear ? 'Add Top Result' : 'Add Year Folder'}
        </button>
      </div>

      {!selectedYear ? (
        // Folder View
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading ? (
            <p className="text-gray-500 p-4">Loading folders...</p>
          ) : years.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border">No folders yet. Click Add Year Folder to start.</div>
          ) : (
            years.map(year => (
              <div 
                key={year} 
                onClick={() => setSelectedYear(year)}
                className="bg-white border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow group"
              >
                <div className="w-16 h-12 bg-blue-100 rounded-t-lg rounded-b-sm relative mb-3 group-hover:scale-105 transition-transform">
                  <div className="absolute -top-2 left-0 w-1/2 h-2 bg-blue-100 rounded-t-md"></div>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Batch {year}</h3>
                <p className="text-xs text-gray-500">{results.filter(r => r.year === year).length} students</p>
              </div>
            ))
          )}
        </div>
      ) : (
        // List View
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
              <input
                placeholder="Search by student name..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 36px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  {['Photo', 'Name', 'Class', 'Score', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: C.muted }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: C.muted }}>No results found in this folder.</td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={r.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : '#fafbff' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img src={r.photo_url} alt={r.student_name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: C.navy }}>{r.student_name}</td>
                    <td style={{ padding: '12px 16px', color: C.muted }}>{r.class}</td>
                    <td style={{ padding: '12px 16px', color: C.navy, fontWeight: 700 }}>{r.score}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(r)} style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteId(r.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: C.white, borderRadius: 16, padding: 32, maxWidth: 380, width: '90%' }}>
            <h3 style={{ color: C.navy, fontWeight: 700, marginBottom: 12 }}>Delete Result?</h3>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>This will permanently remove this result.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: '10px 20px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#ef4444', color: C.white, cursor: 'pointer', fontWeight: 700 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => !saving && setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, color: C.navy, fontSize: '1.2rem' }}>{editId ? 'Edit Result' : 'Add Top Result'}</h2>
              <button onClick={() => setShowModal(false)} disabled={saving} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} color={C.muted} /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Student Name *</label>
                  <input type="text" required value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-smd-blue transition-colors bg-white text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Year *</label>
                  <input type="number" required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-smd-blue transition-colors bg-white text-slate-800" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Class/Standard *</label>
                  <input type="text" required placeholder="e.g. 12th Science" value={form.student_class} onChange={e => setForm({ ...form, student_class: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-smd-blue transition-colors bg-white text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Score/Percentage *</label>
                  <input type="text" required placeholder="e.g. 98% or 9.8 CGPA" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-smd-blue transition-colors bg-white text-slate-800" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Description (Optional)</label>
                <input type="text" placeholder="e.g. District Topper" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 outline-none focus:border-smd-blue transition-colors bg-white text-slate-800" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Student Photo {editId ? '(Optional)' : '*'}</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                  <input
                    type="file" accept="image/jpeg, image/png, image/webp"
                    onChange={e => setSelectedFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    {...(!editId ? { required: true } : {})}
                  />
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileImage size={32} className="text-green-500" />
                      <span className="text-sm font-semibold text-slate-700">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud size={32} className="text-slate-400" />
                      <span className="text-sm text-slate-500">
                        {editId ? 'Click to upload a new photo (optional)' : 'Click or drag photo here'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full mt-4 py-3 font-semibold text-white bg-smd-blue hover:bg-blue-900 rounded-xl transition-colors flex items-center justify-center gap-2">
                {saving ? <Loader2 size={18} className="animate-spin" /> : editId ? 'Update Result' : 'Upload Result'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {showFolderModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowFolderModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, color: C.navy, fontSize: '1.2rem' }}>Create Year Folder</h2>
              <button onClick={() => setShowFolderModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} color={C.muted} /></button>
            </div>
            <form onSubmit={handleAddFolder}>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Year *</label>
              <input type="number" required placeholder="e.g. 2027" value={newYear} onChange={e => setNewYear(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 outline-none focus:border-smd-blue transition-colors bg-white text-slate-800 mb-6" />
              <button type="submit" className="w-full py-3 font-semibold text-white bg-smd-blue hover:bg-blue-900 rounded-xl transition-colors">
                Create Folder
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  )
}
