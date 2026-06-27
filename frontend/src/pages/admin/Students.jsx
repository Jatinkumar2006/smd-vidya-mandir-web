import { Helmet } from 'react-helmet-async'
export default function AdminStudents() {
  return (
    <>
      <Helmet><title>Students – Admin – SMD</title></Helmet>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Students</h1>
        <div className="card"><p className="text-sm text-gray-500">This module is coming in Phase 2.</p></div>
      </div>
    </>
  )
}
