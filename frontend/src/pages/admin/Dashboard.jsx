import { Helmet } from 'react-helmet-async'
import { Users, FileText, Bell, Image, TrendingUp } from 'lucide-react'

const STATS = [
  { label: 'Total Students',    value: '487',  icon: Users,     color: 'bg-blue-50 text-blue-600' },
  { label: 'Pending Admissions', value: '12',  icon: FileText,  color: 'bg-yellow-50 text-yellow-600' },
  { label: 'Active Notices',    value: '5',    icon: Bell,      color: 'bg-green-50 text-green-600' },
  { label: 'Gallery Items',     value: '86',   icon: Image,     color: 'bg-purple-50 text-purple-600' },
]

export default function AdminDashboard() {
  return (
    <>
      <Helmet><title>Admin Dashboard – SMD</title></Helmet>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card flex items-center gap-4">
              <div className={`p-3 rounded-xl ${color}`}><Icon size={24} /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-smd-blue" />
            <h2 className="font-semibold text-gray-900">Analytics coming in Phase 3</h2>
          </div>
          <p className="text-sm text-gray-500">Charts for attendance trends, admission stats, and academic performance will appear here.</p>
        </div>
      </div>
    </>
  )
}
