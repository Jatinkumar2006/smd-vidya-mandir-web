import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import ScrollToTop from '@/components/common/ScrollToTop'

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
const NotFound = lazy(() => import('@/pages/public/NotFound'))
const Login = lazy(() => import('@/pages/public/Login'))

const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const AdminStudents = lazy(() => import('@/pages/admin/Students'))
const AdminGallery = lazy(() => import('@/pages/admin/Gallery'))
const AdminNotices = lazy(() => import('@/pages/admin/Notices'))
const AdminAdmissions = lazy(() => import('@/pages/admin/Admissions'))
const AdminCareers = lazy(() => import('@/pages/admin/Careers'))
const AdminDocuments = lazy(() => import('@/pages/admin/Documents'))

const StudentDashboard = lazy(() => import('@/pages/student/Dashboard'))
const StudentResults = lazy(() => import('@/pages/student/Results'))
const StudentAttendance = lazy(() => import('@/pages/student/Attendance'))

const TeacherDashboard = lazy(() => import('@/pages/teacher/Dashboard'))
const TeacherMarks = lazy(() => import('@/pages/teacher/Marks'))
const TeacherAttendance = lazy(() => import('@/pages/teacher/Attendance'))

const ParentDashboard = lazy(() => import('@/pages/parent/Dashboard'))

/**
 * Main Application Component.
 * Sets up the React Router structure, wraps the app in the AuthProvider,
 * and defines all public, protected, and role-based routes.
 */
export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
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
            <Route path="/mpd"         element={<MPD />} />
            <Route path="/login"       element={<Login />} />
          </Route>

          {/* ── Admin Routes ── */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<DashboardLayout role="admin" />}>
              <Route path="/admin"              element={<AdminDashboard />} />
              <Route path="/admin/students"     element={<AdminStudents />} />
              <Route path="/admin/gallery"      element={<AdminGallery />} />
              <Route path="/admin/notices"      element={<AdminNotices />} />
              <Route path="/admin/admissions"   element={<AdminAdmissions />} />
              <Route path="/admin/careers"      element={<AdminCareers />} />
              <Route path="/admin/documents"    element={<AdminDocuments />} />
            </Route>
          </Route>

          {/* ── Teacher Routes ── */}
          <Route element={<ProtectedRoute role="teacher" />}>
            <Route element={<DashboardLayout role="teacher" />}>
              <Route path="/teacher"             element={<TeacherDashboard />} />
              <Route path="/teacher/marks"       element={<TeacherMarks />} />
              <Route path="/teacher/attendance"  element={<TeacherAttendance />} />
            </Route>
          </Route>

          {/* ── Student Routes ── */}
          <Route element={<ProtectedRoute role="student" />}>
            <Route element={<DashboardLayout role="student" />}>
              <Route path="/student"             element={<StudentDashboard />} />
              <Route path="/student/results"     element={<StudentResults />} />
              <Route path="/student/attendance"  element={<StudentAttendance />} />
            </Route>
          </Route>

          {/* ── Parent Routes ── */}
          <Route element={<ProtectedRoute role="parent" />}>
            <Route element={<DashboardLayout role="parent" />}>
              <Route path="/parent" element={<ParentDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}
