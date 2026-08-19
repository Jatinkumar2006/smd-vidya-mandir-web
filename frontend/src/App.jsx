import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { SettingsProvider } from '@/context/SettingsContext'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import ScrollToTop from '@/components/common/ScrollToTop'
import { Toaster } from 'react-hot-toast'

// Layouts (Load these immediately to prevent layout shifts)
import PublicLayout from '@/components/layout/PublicLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Lazy-loaded Pages
const Home = lazy(() => import('@/pages/public/Home'))
const About = lazy(() => import('@/pages/public/About'))
const Academics = lazy(() => import('@/pages/public/Academics'))
const Facilities = lazy(() => import('@/pages/public/Facilities'))
const Gallery = lazy(() => import('@/pages/public/Gallery'))
const Contact = lazy(() => import('@/pages/public/Contact'))
const Admissions = lazy(() => import('@/pages/public/Admissions'))
const MPD = lazy(() => import('@/pages/public/MPD'))
const Careers = lazy(() => import('@/pages/public/Careers'))
const Results = lazy(() => import('@/pages/public/Results'))
const NotFound = lazy(() => import('@/pages/public/NotFound'))
const Login = lazy(() => import('@/pages/public/Login'))
const ForgotPassword = lazy(() => import('@/pages/public/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/public/ResetPassword'))

const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminResults = lazy(() => import('@/pages/admin/Results'))
const AdminGallery = lazy(() => import('@/pages/admin/Gallery'))
const AdminNotices = lazy(() => import('@/pages/admin/Notices'))
const AdminLeadership = lazy(() => import('@/pages/admin/Leadership'))
const AdminAdmissions = lazy(() => import('@/pages/admin/Admissions'))
const AdminCareers = lazy(() => import('@/pages/admin/Careers'))
const AdminDocuments = lazy(() => import('@/pages/admin/Documents'))
const AdminSettings = lazy(() => import('@/pages/admin/Settings'))

/**
 * Main Application Component.
 * Sets up the React Router structure, wraps the app in the AuthProvider,
 * and defines all public, protected, and role-based routes.
 */
export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-smd-blue font-medium">Loading...</div>}>
          <Routes>
            {/* ── Public Routes ── */}
            <Route element={<PublicLayout />}>
              <Route path="/"            element={<Home />} />
              <Route path="/about"       element={<About />} />
              <Route path="/academics"   element={<Academics />} />
              <Route path="/facilities"  element={<Facilities />} />
              <Route path="/gallery"     element={<Gallery />} />
              <Route path="/contact"     element={<Contact />} />
              <Route path="/admissions"  element={<Admissions />} />
              <Route path="/careers"     element={<Careers />} />
              <Route path="/results"     element={<Results />} />
              <Route path="/mpd"         element={<MPD />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* ── Admin Routes ── */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route element={<DashboardLayout role="admin" />}>
                <Route path="/admin"              element={<AdminDashboard />} />
                <Route path="/admin/results"      element={<AdminResults />} />
                <Route path="/admin/gallery"      element={<AdminGallery />} />
                <Route path="/admin/notices"      element={<AdminNotices />} />
                <Route path="/admin/admissions"   element={<AdminAdmissions />} />
                <Route path="/admin/careers"      element={<AdminCareers />} />
                <Route path="/admin/documents"    element={<AdminDocuments />} />
                <Route path="/admin/leadership"   element={<AdminLeadership />} />
                <Route path="/admin/settings"     element={<AdminSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </SettingsProvider>
    </AuthProvider>
  )
}
