import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import ScrollToTop from '@/components/common/ScrollToTop'

// Public Pages
import Home from '@/pages/public/Home'
import About from '@/pages/public/About'
import Academics from '@/pages/public/Academics'
import Facilities from '@/pages/public/Facilities'
import Gallery from '@/pages/public/Gallery'
import Contact from '@/pages/public/Contact'
import Admissions from '@/pages/public/Admissions'
import MPD from '@/pages/public/MPD'
import Careers from '@/pages/public/Careers'
import NotFound from '@/pages/public/NotFound'

// Auth
import Login from '@/pages/public/Login'

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminStudents from '@/pages/admin/Students'
import AdminGallery from '@/pages/admin/Gallery'
import AdminNotices from '@/pages/admin/Notices'
import AdminAdmissions from '@/pages/admin/Admissions'
import AdminCareers from '@/pages/admin/Careers'
import AdminDocuments from '@/pages/admin/Documents'

// Student Pages
import StudentDashboard from '@/pages/student/Dashboard'
import StudentResults from '@/pages/student/Results'
import StudentAttendance from '@/pages/student/Attendance'

// Teacher Pages
import TeacherDashboard from '@/pages/teacher/Dashboard'
import TeacherMarks from '@/pages/teacher/Marks'
import TeacherAttendance from '@/pages/teacher/Attendance'

// Parent Pages
import ParentDashboard from '@/pages/parent/Dashboard'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'

/**
 * Main Application Component.
 * Sets up the React Router structure, wraps the app in the AuthProvider,
 * and defines all public, protected, and role-based routes.
 */
export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
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
    </AuthProvider>
  )
}
