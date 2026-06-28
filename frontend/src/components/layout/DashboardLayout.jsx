import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { AnimatePresence, motion } from 'framer-motion'

export default function DashboardLayout({ role }) {
  const location = useLocation()
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
