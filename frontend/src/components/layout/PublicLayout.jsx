import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIChatbot from '@/components/common/AIChatbot'
import { AnimatePresence, motion } from 'framer-motion'

export default function PublicLayout() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
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
      <Footer />
      <AIChatbot />
    </div>
  )
}
