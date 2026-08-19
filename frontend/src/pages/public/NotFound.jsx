import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found – SMD Vidya Mandir</title></Helmet>
      
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4" style={{ background: '#f7f9ff' }}>
        <div style={{ fontSize: '6rem', fontWeight: 900, color: '#0a143c', lineHeight: 1, marginBottom: '16px' }}>404</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Merriweather',serif" }}>Oops! Page Not Found</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-[15px] leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-smd-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-900 transition-colors shadow-[0_4px_14px_rgba(10,20,60,0.25)]">
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </>
  )
}
