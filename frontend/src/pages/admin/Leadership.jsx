import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Trash2, X, Users, UploadCloud, FileImage, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function AdminLeadership() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', post: '', sort_order: 0 })
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const load = async () => {
    try {
      const { data } = await api.get('/leadership')
      setLeaders(data)
    } catch {
      toast.error('Failed to load leadership team')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    const form = new FormData()
    form.append('name', formData.name)
    form.append('post', formData.post)
    form.append('sort_order', formData.sort_order)
    if (selectedFile) form.append('image', selectedFile)

    try {
      if (editingId) {
        await api.put(`/leadership/${editingId}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Leader updated successfully!')
      } else {
        await api.post('/leadership', form, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Leader added successfully!')
      }
      setShowModal(false)
      load()
    } catch (err) {
      toast.error('Failed to save leader')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leader?')) return
    try {
      await api.delete(`/leadership/${id}`)
      toast.success('Leader removed')
      load()
    } catch {
      toast.error('Delete failed')
    }
  }

  const openNew = () => {
    setEditingId(null)
    setFormData({ name: '', post: '', sort_order: leaders.length })
    setSelectedFile(null)
    setShowModal(true)
  }

  const openEdit = (leader) => {
    setEditingId(leader.id)
    setFormData({ name: leader.name, post: leader.post, sort_order: leader.sort_order })
    setSelectedFile(null)
    setShowModal(true)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Helmet><title>Leadership – Admin – SMD Vidya Mandir</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-smd-blue tracking-tight">Our Leadership</h1>
          <p className="text-sm text-slate-500 mt-1">Manage the leadership profiles displayed on the About page.</p>
        </div>
        <button 
          onClick={openNew}
          className="bg-smd-blue text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-all shadow-sm flex items-center gap-2 hover:shadow-md"
        >
          <Plus size={18} /> Add Leader
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSaving && setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Leader' : 'Add New Leader'}</h2>
                <button onClick={() => !isSaving && setShowModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full"><X size={20}/></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Name</label>
                    <input
                      type="text" required placeholder="e.g. Shri Mangalchand Didwaniya"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-smd-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Post / Title</label>
                    <input
                      type="text" required placeholder="e.g. Founder & Chairman"
                      value={formData.post}
                      onChange={e => setFormData({ ...formData, post: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-smd-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Sort Order</label>
                    <input
                      type="number" required
                      value={formData.sort_order}
                      onChange={e => setFormData({ ...formData, sort_order: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-smd-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Photo</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                      <input
                        type="file" accept="image/*"
                        onChange={e => setSelectedFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...(!editingId ? { required: true } : {})}
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
                            {editingId ? 'Click to upload a new photo' : 'Click or drag photo here'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => setShowModal(false)} disabled={isSaving} className="flex-1 py-3 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="flex-1 py-3 font-semibold text-white bg-smd-blue hover:bg-blue-900 rounded-xl transition-colors">
                    {isSaving ? 'Saving...' : 'Save Leader'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Leaders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-smd-blue rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Loading leadership...</p>
          </div>
        ) : leaders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No leaders added yet</h3>
            <p className="text-slate-500 mt-1">Add the first member of the leadership team.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map(l => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                key={l.id} 
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-center relative group"
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEdit(l)}
                    className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(l.id)} 
                    className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {l.image_url ? (
                  <img src={l.image_url} alt={l.name} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 mx-auto mb-4 shadow-sm" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 shadow-sm border-4 border-slate-50">
                    <ImageIcon size={32} />
                  </div>
                )}
                
                <h3 className="font-bold text-slate-800 text-lg mb-1">{l.name}</h3>
                <p className="text-smd-orange font-semibold text-sm uppercase tracking-wider">{l.post}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 font-medium">
                  Sort Order: {l.sort_order}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
