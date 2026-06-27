import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import DashboardHeader from '@/components/layout/DashboardHeader'

export default function DashboardLayout({ role }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
