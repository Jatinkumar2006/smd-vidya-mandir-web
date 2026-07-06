import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, Calendar, Bell, Image, FileText, BarChart2, GraduationCap, Briefcase, Folder } from 'lucide-react'

const MENUS = {
  admin:   [
    { to: '/admin',             icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/students',    icon: Users,           label: 'Students' },
    { to: '/admin/admissions',  icon: FileText,        label: 'Admissions' },
    { to: '/admin/notices',     icon: Bell,            label: 'Notices' },
    { to: '/admin/gallery',     icon: Image,           label: 'Gallery' },
    { to: '/admin/careers',     icon: Briefcase,       label: 'Careers' },
    { to: '/admin/documents',   icon: Folder,          label: 'Documents' },
  ],
  teacher: [
    { to: '/teacher',            icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/teacher/marks',      icon: BookOpen,        label: 'Marks' },
    { to: '/teacher/attendance', icon: Calendar,        label: 'Attendance' },
  ],
  student: [
    { to: '/student',             icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/results',     icon: BarChart2,       label: 'Results' },
    { to: '/student/attendance',  icon: Calendar,        label: 'Attendance' },
  ],
  parent: [
    { to: '/parent', icon: LayoutDashboard, label: 'Dashboard' },
  ],
}

export default function Sidebar({ role }) {
  const items = MENUS[role] || []
  return (
    <aside className="w-60 bg-smd-blue text-white flex flex-col min-h-screen shrink-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/20">
        <GraduationCap size={24} className="text-smd-gold" />
        <span className="font-bold text-sm">SMD Campus</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
