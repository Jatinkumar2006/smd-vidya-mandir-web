import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  return (
    <>
      <Helmet><title>NotFound – SMD Vidya Mandir</title></Helmet>
      <div className="section-padding container-max">
        <h1 className="text-3xl font-bold text-smd-blue mb-4">NotFound</h1>
        <p className="text-gray-500">This page is under construction. Content coming soon.</p>
      </div>
    </>
  )
}
