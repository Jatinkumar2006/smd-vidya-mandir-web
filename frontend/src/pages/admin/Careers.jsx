import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Briefcase, Plus, Trash2, Users, CheckCircle, XCircle, X, FileText, Phone, Mail, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function AdminCareers() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAppsModal, setShowAppsModal] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [applications, setApplications] = useState([])
  const [appsLoading, setAppsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '', department: '', type: 'Full-time', experience: '', description: ''
  })

  useEffect(() => { fetchCareers() }, [])

  const fetchCareers = async () => {
    try {
      const { data } = await api.get('/careers/admin/all')
      setCareers(data)
    } catch (err) {
      toast.error('Failed to fetch careers')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/careers/admin', formData)
      toast.success('Job posting created successfully!')
      setShowAddModal(false)
      setFormData({ title: '', department: '', type: 'Full-time', experience: '', description: '' })
      fetchCareers()
    } catch (err) {
      toast.error('Failed to add career posting')
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/careers/admin/${id}`, { active: !currentStatus })
      toast.success(`Job marked as ${!currentStatus ? 'Active' : 'Inactive'}`)
      fetchCareers()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this posting?')) return
    try {
      await api.delete(`/careers/admin/${id}`)
      toast.success('Posting deleted')
      fetchCareers()
    } catch (err) {
      toast.error('Failed to delete posting')
    }
  }

  const viewApplications = async (career) => {
    setSelectedCareer(career)
    setShowAppsModal(true)
    setAppsLoading(true)
    try {
      const { data } = await api.get(`/careers/admin/${career.id}/applications`)
      setApplications(data)
    } catch (err) {
      toast.error('Failed to fetch applications')
    } finally {
      setAppsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Helmet><title>Careers – Admin – SMD Vidya Mandir</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-smd-blue tracking-tight">Careers & Recruitment</h1>
          <p className="text-sm text-slate-500 mt-1">Manage job postings and review candidate applications.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-smd-blue text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-all shadow-sm flex items-center gap-2 hover:shadow-md"
        >
          <Plus size={18} /> Create Posting
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-2 border-slate-200 border-t-smd-blue rounded-full animate-spin mb-3"></div>
                      <p className="text-slate-500 text-sm">Loading careers...</p>
                    </div>
                  </td>
                </tr>
              ) : careers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Briefcase size={48} className="mb-4 opacity-20" />
                      <p className="text-base font-medium text-slate-600">No job postings found</p>
                      <p className="text-sm mt-1">Click "Create Posting" to open a new vacancy.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                careers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{c.title}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{c.type}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{c.department}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{c.experience}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(c.id, c.active)} className="focus:outline-none hover:scale-105 transition-transform">
                        {c.active ? (
                          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> Active</span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14}/> Closed</span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-3">
                      <button onClick={() => viewApplications(c)} className="text-smd-blue hover:text-white hover:bg-smd-blue flex items-center gap-1.5 text-sm font-medium bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg transition-all">
                        <Users size={16} /> Applications
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete Posting">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800">Create Job Posting</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Job Title</label>
                  <input required type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue transition-all" placeholder="e.g. Senior Physics Teacher" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Department</label>
                    <input required type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue transition-all" placeholder="e.g. Science" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Job Type</label>
                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue transition-all" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Experience Required</label>
                  <input required type="text" placeholder="e.g. Minimum 3 Years" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue transition-all" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description (Optional)</label>
                  <textarea rows="3" placeholder="Briefly describe the role..." className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue transition-all resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 font-medium bg-smd-blue text-white rounded-xl hover:bg-blue-800 shadow-sm transition-all">Publish Job</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLICATIONS MODAL */}
      <AnimatePresence>
        {showAppsModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden max-h-[85vh] flex flex-col border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Review Applications</h2>
                  <p className="text-sm font-medium text-smd-blue mt-0.5">{selectedCareer?.title}</p>
                </div>
                <button onClick={() => setShowAppsModal(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                {appsLoading ? (
                  <div className="flex flex-col items-center justify-center h-48">
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-smd-blue rounded-full animate-spin mb-3"></div>
                    <p className="text-slate-500 text-sm">Fetching applications...</p>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <FileText size={40} className="mb-3 opacity-20" />
                    <p className="font-medium text-slate-600">No applications received yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {applications.map(app => (
                      <div key={app.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-lg mb-4">{app.applicant_name}</h4>
                          <div className="space-y-2">
                            <a href={`mailto:${app.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-smd-blue">
                              <Mail size={14} className="text-slate-400" /> {app.email}
                            </a>
                            <a href={`tel:${app.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-smd-blue">
                              <Phone size={14} className="text-slate-400" /> {app.phone}
                            </a>
                            <p className="flex items-center gap-2 text-sm text-slate-600">
                              <Briefcase size={14} className="text-slate-400" /> {app.experience}
                            </p>
                            <p className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock size={14} className="text-slate-400" /> {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 pt-4 border-t border-slate-100">
                          <a 
                            href={app.resume_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-slate-50 text-smd-blue border border-blue-100 hover:bg-smd-blue hover:text-white hover:border-smd-blue py-2 rounded-lg font-bold text-sm transition-all"
                          >
                            <FileText size={16} /> View Resume
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
