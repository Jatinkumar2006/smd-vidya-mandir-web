import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, XCircle, Clock, Trash2, BookOpen, X, Phone, Mail, MapPin, User, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/services/api'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending:  { color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200', icon: Clock,        label: 'Pending'  },
  approved: { color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200', icon: CheckCircle,  label: 'Approved' },
  rejected: { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200', icon: XCircle,      label: 'Rejected' },
}

export default function AdminAdmissions() {
  const [apps, setApps]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [filterStatus, setFilter]   = useState('')
  const [selected, setSelected]     = useState(null)
  const [updating, setUpdating]     = useState(null)

  const load = async () => {
    try {
      const params = filterStatus ? `?status=${filterStatus}` : ''
      const { data } = await api.get(`/admissions${params}`)
      setApps(data)
    } catch { 
      toast.error('Failed to load applications') 
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { load() }, [filterStatus])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      await api.put(`/admissions/${id}/status`, { status })
      toast.success(`Application ${status}!`)
      load()
      if (selected?.id === id) setSelected({ ...selected, status })
    } catch { 
      toast.error('Failed to update status') 
    } finally { 
      setUpdating(null) 
    }
  }

  const deleteApp = async (id) => {
    try {
      await api.delete(`/admissions/${id}`)
      toast.success('Application deleted')
      setSelected(null); load()
    } catch { 
      toast.error('Delete failed') 
    }
  }

  const counts = { 
    all: apps.length, 
    ...Object.fromEntries(['pending','approved','rejected'].map(s => [s, apps.filter(a => a.status === s).length])) 
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Helmet><title>Admissions – Admin – SMD Vidya Mandir</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-smd-blue tracking-tight">Admission Applications</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and review student admission inquiries.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[{ val: '', label: `All (${counts.all})` }, { val: 'pending', label: `Pending (${counts.pending})` }, { val: 'approved', label: `Approved (${counts.approved})` }, { val: 'rejected', label: `Rejected (${counts.rejected})` }].map(({ val, label }) => (
            <button key={val} onClick={() => setFilter(val)} 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                filterStatus === val 
                  ? 'bg-smd-blue text-white border-smd-blue shadow-sm' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${selected ? 'lg:grid-cols-[1fr_400px]' : ''} gap-6 transition-all duration-300`}>
        
        {/* Table Section */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Student Details', 'Class', 'Parent / Contact', 'Date', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-2 border-slate-200 border-t-smd-blue rounded-full animate-spin mb-3"></div>
                        <p className="text-slate-500 text-sm">Loading applications...</p>
                      </div>
                    </td>
                  </tr>
                ) : apps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <BookOpen size={48} className="mb-4 opacity-20" />
                        <p className="text-base font-medium text-slate-600">No applications found</p>
                        <p className="text-sm mt-1">New admission inquiries will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  apps.map((a) => {
                    const cfg = STATUS_CONFIG[a.status]
                    const Icon = cfg.icon
                    const isSelected = selected?.id === a.id
                    
                    return (
                      <tr key={a.id} 
                        onClick={() => setSelected(isSelected ? null : a)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/80 bg-white'}`}
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{a.student_name}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5 capitalize">{a.gender || 'Not specified'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                            Class {a.class_applying}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-700">{a.parent_name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{a.phone}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-slate-700">{new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{new Date(a.created_at).toLocaleDateString('en-IN', { year: 'numeric' })}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            <Icon size={14} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteApp(a.id) }} 
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                            title="Delete Application"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selected && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <h3 className="text-lg font-bold text-smd-blue">Application Details</h3>
                <button onClick={() => setSelected(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6 space-y-6 flex-1">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl uppercase">
                    {selected.student_name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800">{selected.student_name}</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold mt-1">
                      Applying for Class {selected.class_applying}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1"><User size={12}/> Gender</p>
                    <p className="text-sm font-semibold text-slate-700 capitalize">{selected.gender || 'Not specified'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1"><Calendar size={12}/> Date of Birth</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {selected.dob ? new Date(selected.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Parent Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Parent / Guardian Info</h4>
                  
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{selected.parent_name}</p>
                    <p className="text-xs text-slate-500 font-medium">{selected.relation || 'Parent'}</p>
                  </div>

                  <div className="space-y-3">
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-smd-blue transition-colors p-2 -mx-2 rounded-lg hover:bg-slate-50">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Phone size={14}/></div>
                      {selected.phone}
                    </a>
                    {selected.email && (
                      <a href={`mailto:${selected.email}`} className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-smd-blue transition-colors p-2 -mx-2 rounded-lg hover:bg-slate-50">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Mail size={14}/></div>
                        {selected.email}
                      </a>
                    )}
                    {selected.address && (
                      <div className="flex items-start gap-3 text-sm font-medium text-slate-600 p-2 -mx-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><MapPin size={14}/></div>
                        <span className="mt-1 leading-relaxed">{selected.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                {selected.status === 'pending' ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => updateStatus(selected.id, 'rejected')} 
                      disabled={updating === selected.id}
                      className="flex-1 py-2.5 px-4 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                    <button 
                      onClick={() => updateStatus(selected.id, 'approved')} 
                      disabled={updating === selected.id}
                      className="flex-[2] py-2.5 px-4 bg-emerald-500 border border-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle size={18} /> Approve Application
                    </button>
                  </div>
                ) : (() => {
                  const Icon = STATUS_CONFIG[selected.status].icon;
                  return (
                    <div className={`p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].color} ${STATUS_CONFIG[selected.status].border}`}>
                      <Icon size={18} />
                      Application {STATUS_CONFIG[selected.status].label}
                    </div>
                  );
                })()}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
