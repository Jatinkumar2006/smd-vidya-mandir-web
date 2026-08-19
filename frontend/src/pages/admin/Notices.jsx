import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Trash2, Sparkles, X, Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/services/api'
import toast from 'react-hot-toast'

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
    } catch { 
      toast.error('Failed to load notices') 
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await api.post('/notices', form)
      toast.success('Notice published successfully!')
      setForm({ title: '', content: '' }); setShowForm(false); load()
    } catch { 
      toast.error('Failed to create notice') 
    } finally { 
      setSaving(false) 
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notice?')) return
    try {
      await api.delete(`/notices/${id}`)
      toast.success('Notice removed')
      load()
    } catch { 
      toast.error('Delete failed') 
    }
  }

  const generateWithAI = async () => {
    if (!aiTopic.trim()) return toast.error('Enter a topic first')
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/notice', { topic: aiTopic })
      const lines = data.notice.trim().split('\n').filter(l => l.trim())
      const titleLine = lines.find(l => l.toLowerCase().startsWith('subject:'))
      const title = titleLine ? titleLine.replace(/^subject:\s*/i, '').trim() : aiTopic
      setForm({ title, content: data.notice })
      setShowForm(true)
      toast.success('AI notice generated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed. Is the Groq API key set?')
    } finally { 
      setAiLoading(false) 
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Helmet><title>Notices – Admin – SMD Vidya Mandir</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-smd-blue tracking-tight">Notices & Announcements</h1>
          <p className="text-sm text-slate-500 mt-1">Publish circulars and announcements for students and parents.</p>
        </div>
        <button 
          onClick={() => { setForm({ title: '', content: '' }); setShowForm(true) }}
          className="bg-smd-blue text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-all shadow-sm flex items-center gap-2 hover:shadow-md"
        >
          <Plus size={18} /> New Notice
        </button>
      </div>

      {/* AI Notice Generator */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-900 to-smd-blue rounded-2xl p-6 shadow-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <Sparkles size={120} className="text-white" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={20} className="text-smd-gold" />
            <h2 className="font-bold text-lg text-white">AI Notice Generator</h2>
            <span className="bg-smd-gold text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider">GROQ AI</span>
          </div>
          <p className="text-blue-100 text-sm mb-5 max-w-2xl">Type a topic and let our AI draft a perfectly formatted, professional school notice for you in seconds.</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              placeholder="e.g. Annual Sports Day schedule, Parent-Teacher Meeting tomorrow..."
              value={aiTopic} onChange={e => setAiTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateWithAI()}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-smd-gold/50 transition-all"
            />
            <button 
              onClick={generateWithAI} disabled={aiLoading} 
              className="bg-smd-gold text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
            >
              {aiLoading ? (
                <><div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> Generating...</>
              ) : (
                <>✨ Generate Draft</>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-2">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg text-smd-blue">Draft Notice</h3>
                <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X size={18} /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Subject / Title <span className="text-red-500">*</span></label>
                  <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue transition-all" 
                    placeholder="Notice Subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Content <span className="text-red-500">*</span></label>
                  <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue transition-all resize-y" 
                    placeholder="Dear Parents/Students..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 bg-smd-blue text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-all shadow-sm disabled:opacity-70">
                    {saving ? 'Publishing...' : 'Publish Notice'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-8 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-smd-blue rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
            <Bell size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No active notices</h3>
            <p className="text-slate-500 mt-1">Create a new notice or use AI to generate one instantly.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notices.map(n => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                key={n.id} 
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow group"
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <h3 className="font-bold text-slate-800 text-lg">{n.title}</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line mb-4 line-clamp-3">
                      {n.content}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                        {new Date(n.created_at).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(n.id)} 
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0 focus:outline-none"
                    title="Delete Notice"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
