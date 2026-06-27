import { Helmet } from 'react-helmet-async'
import { useAuth } from '@/context/AuthContext'

export default function ParentDashboard() {
  const { user } = useAuth()
  return (
    <>
      <Helmet><title>Parent Dashboard – SMD</title></Helmet>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
        <p className="text-gray-500 mb-6">Your parent dashboard. Features will be added in Phase 3.</p>
        <div className="card">
          <p className="text-sm text-gray-400">Content coming soon...</p>
        </div>
      </div>
    </>
  )
}
