import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Users, FileText, Bell, Image, TrendingUp, Clock, CheckCircle, XCircle, ArrowRight, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/services/api'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats]     = useState({ total_students: 0, pending_admissions: 0, active_notices: 0, gallery_items: 0 })
  const [notices, setNotices] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, noticesRes, admRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/notices'),
          api.get('/admissions'),
        ])
        setStats(statsRes.data)
        setNotices(noticesRes.data.slice(0, 4))
        setAdmissions(admRes.data.slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const STAT_CARDS = [
    { label: 'Total Students',     value: stats.total_students,     icon: Users,     color: 'text-blue-600',   bg: 'bg-blue-100', link: '/admin' },
    { label: 'Pending Admissions', value: stats.pending_admissions, icon: Clock,      color: 'text-amber-600', bg: 'bg-amber-100', link: '/admin/admissions' },
    { label: 'Active Notices',     value: stats.active_notices,     icon: Bell,       color: 'text-emerald-600', bg: 'bg-emerald-100', link: '/admin/notices' },
    { label: 'Gallery Items',      value: stats.gallery_items,      icon: Image,      color: 'text-purple-600',  bg: 'bg-purple-100', link: '/admin/gallery' },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1"><CheckCircle size={12}/> Approved</span>
      case 'rejected': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center gap-1"><XCircle size={12}/> Rejected</span>
      default: return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1"><Clock size={12}/> Pending</span>
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-smd-blue rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium animate-pulse">Loading dashboard data...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Helmet><title>Admin Dashboard – SMD Vidya Mandir</title></Helmet>

      <div>
        <h1 className="text-2xl font-bold text-smd-blue tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here is what's happening at your school today.</p>
      </div>

      {/* Stat Cards */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg, link }) => (
          <motion.div key={label} variants={itemVariants} 
            onClick={() => navigate(link)}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-5 relative overflow-hidden group cursor-pointer"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${bg} group-hover:scale-150 transition-transform duration-500`}></div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon size={26} className={color} />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-800">{value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Admissions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col"
        >
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-smd-blue" />
              <h2 className="font-semibold text-slate-800">Recent Admissions</h2>
            </div>
            <Link to="/admin/admissions" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-2 flex-1">
            {admissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <BookOpen size={40} className="mb-3 opacity-20" />
                <p className="text-sm">No recent applications.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {admissions.map(a => (
                  <div key={a.id} onClick={() => navigate('/admin/admissions')} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-xl cursor-pointer">
                    <div>
                      <p className="font-semibold text-slate-800">{a.student_name}</p>
                      <p className="text-xs text-slate-500 mt-1">Class {a.class_applying} • {new Date(a.created_at).toLocaleDateString()}</p>
                    </div>
                    {getStatusBadge(a.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Notices */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col"
        >
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-smd-blue" />
              <h2 className="font-semibold text-slate-800">Recent Notices</h2>
            </div>
            <Link to="/admin/notices" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-2 flex-1">
            {notices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <Bell size={40} className="mb-3 opacity-20" />
                <p className="text-sm">No active notices.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notices.map(n => (
                  <div key={n.id} onClick={() => navigate('/admin/notices')} className="p-4 hover:bg-slate-50 transition-colors rounded-xl cursor-pointer">
                    <p className="font-semibold text-slate-800 truncate">{n.title}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                        {n.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(n.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
