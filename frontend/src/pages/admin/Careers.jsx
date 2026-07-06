import { useState, useEffect } from 'react'
import { Briefcase, Plus, Trash2, Users, CheckCircle, XCircle } from 'lucide-react'
import api from '@/services/api'

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

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    try {
      const { data } = await api.get('/careers/admin/all')
      setCareers(data)
    } catch (err) {
      console.error(err)
      alert('Failed to fetch careers')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/careers/admin', formData)
      setShowAddModal(false)
      setFormData({ title: '', department: '', type: 'Full-time', experience: '', description: '' })
      fetchCareers()
    } catch (err) {
      alert('Failed to add career posting')
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/careers/admin/${id}`, { active: !currentStatus })
      fetchCareers()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this posting?')) return
    try {
      await api.delete(`/careers/admin/${id}`)
      fetchCareers()
    } catch (err) {
      alert('Failed to delete posting')
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
      alert('Failed to fetch applications')
    } finally {
      setAppsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Careers & Recruitment</h1>
          <p className="text-slate-500">Manage job postings and view applications.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-smd-blue text-white px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Posting
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading careers...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">Job Title</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Experience</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {careers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No job postings found.</td>
                </tr>
              ) : (
                careers.map(c => (
                  <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-800">
                      {c.title} <br/>
                      <span className="text-xs text-slate-400 font-normal">{c.type}</span>
                    </td>
                    <td className="p-4 text-slate-600">{c.department}</td>
                    <td className="p-4 text-slate-600">{c.experience}</td>
                    <td className="p-4">
                      <button onClick={() => toggleStatus(c.id, c.active)}>
                        {c.active ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={14}/> Active</span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><XCircle size={14}/> Inactive</span>
                        )}
                      </button>
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <button onClick={() => viewApplications(c)} className="text-smd-blue hover:text-blue-800 flex items-center gap-1 text-sm bg-blue-50 px-3 py-1.5 rounded-lg">
                        <Users size={16} /> Applications
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Create Job Posting</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
                  <select className="w-full px-4 py-2 border rounded-lg bg-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience Required</label>
                <input required type="text" placeholder="e.g. 2+ Years" className="w-full px-4 py-2 border rounded-lg" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <textarea rows="3" className="w-full px-4 py-2 border rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-slate-600 bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-smd-blue text-white rounded-lg">Publish Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLICATIONS MODAL */}
      {showAppsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Applications</h2>
                <p className="text-sm text-slate-500">for {selectedCareer?.title}</p>
              </div>
              <button onClick={() => setShowAppsModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              {appsLoading ? (
                <p className="text-center text-slate-500">Loading applications...</p>
              ) : applications.length === 0 ? (
                <div className="text-center text-slate-500 bg-white p-8 rounded-lg border border-slate-200">No applications received yet.</div>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => (
                    <div key={app.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">{app.applicant_name}</h4>
                          <div className="text-sm text-slate-500 mt-1 space-y-1">
                            <p><span className="font-medium">Email:</span> <a href={`mailto:${app.email}`} className="text-smd-blue hover:underline">{app.email}</a></p>
                            <p><span className="font-medium">Phone:</span> {app.phone}</p>
                            <p><span className="font-medium">Experience:</span> {app.experience}</p>
                            <p><span className="font-medium">Applied:</span> {new Date(app.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <a 
                          href={app.resume_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-smd-gold/10 text-smd-gold hover:bg-smd-gold hover:text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          View Resume
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
