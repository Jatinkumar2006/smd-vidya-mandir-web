import { Helmet } from 'react-helmet-async'
import { FileText, Download, ExternalLink } from 'lucide-react'

const MPD_DOCS = [
  {
    category: 'School Information',
    items: [
      { title: 'CBSE Affiliation Certificate',     file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'Trust / Society Registration',     file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'NOC from State Government',        file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'Recognition Certificate',          file: null, note: 'Upload to /uploads/mpd/' },
    ],
  },
  {
    category: 'Infrastructure & Academics',
    items: [
      { title: 'Building Safety Certificate',      file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'Fire Safety Certificate',          file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'Drinking Water Certificate',       file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'Land Certificate',                 file: null, note: 'Upload to /uploads/mpd/' },
    ],
  },
  {
    category: 'Fee & Results',
    items: [
      { title: 'Fee Structure 2025–26',            file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'Annual Academic Calendar',         file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'Board Exam Result 2024 (Class X)', file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'Board Exam Result 2024 (Class XII)',file: null, note: 'Upload to /uploads/mpd/' },
    ],
  },
  {
    category: 'Staff Information',
    items: [
      { title: 'List of Teaching Staff',           file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'Qualifications of Staff',          file: null, note: 'Upload to /uploads/mpd/' },
      { title: 'List of Non-Teaching Staff',       file: null, note: 'Upload to /uploads/mpd/' },
    ],
  },
]

const INFO_TABLE = [
  { label: 'School Name',         value: 'Shree Mangal Chand Didwania Vidya Mandir' },
  { label: 'Affiliation Board',   value: 'Central Board of Secondary Education (CBSE)' },
  { label: 'Affiliation Number',  value: 'To be updated' },
  { label: 'School Number',       value: 'To be updated' },
  { label: 'Year of Establishment', value: '2009' },
  { label: 'Principal Name',      value: 'To be updated' },
  { label: 'Contact',             value: '+91-9001995272' },
  { label: 'Email',               value: 'smdvidyamandir@gmail.com' },
  { label: 'Address',             value: 'Khori Brahmanan, Raghunathgarh, Sikar, Rajasthan – 332001' },
  { label: 'Classes Offered',     value: 'Class I to XII' },
  { label: 'Medium of Instruction', value: 'Hindi & English' },
  { label: 'Type of School',      value: 'Co-Educational' },
]

export default function MPD() {
  return (
    <>
      <Helmet>
        <title>Mandatory Public Disclosure – SMD Digital Campus</title>
        <meta name="description" content="CBSE Mandatory Public Disclosure documents for SMD School Sikar, Rajasthan." />
      </Helmet>

      {/* Header */}
      <div style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)', padding: '100px 4rem 60px', marginTop: '70px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <p style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>CBSE Compliance</p>
          <h1 style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Mandatory Public Disclosure</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '600px', lineHeight: 1.75 }}>
            As per CBSE guidelines, all affiliated schools are required to publicly disclose the following information and documents.
          </p>
        </div>
      </div>

      {/* CBSE Info notice */}
      <div style={{ background: '#fff8ed', borderBottom: '1px solid #fed7aa', padding: '14px 4rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '16px' }}>ℹ️</span>
          <p style={{ fontSize: '13px', color: '#92400e' }}>
            This page is maintained as per <strong>CBSE Affiliation Bye-Laws</strong>. All documents are updated annually.
            For queries, contact us at <a href="mailto:smdvidyamandir@gmail.com" style={{ color: '#0a143c', fontWeight: 600 }}>smdvidyamandir@gmail.com</a>
          </p>
        </div>
      </div>

      {/* School Info Table */}
      <section style={{ padding: '60px 4rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: '1.5rem', fontWeight: 700, color: '#0a143c', marginBottom: '24px' }}>General School Information</h2>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
            {INFO_TABLE.map(({ label, value }, i) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '280px 1fr', borderBottom: i < INFO_TABLE.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ padding: '14px 20px', background: i % 2 === 0 ? '#f8faff' : '#fff', fontWeight: 600, fontSize: '13.5px', color: '#374151', borderRight: '1px solid #f3f4f6' }}>{label}</div>
                <div style={{ padding: '14px 20px', background: i % 2 === 0 ? '#f8faff' : '#fff', fontSize: '13.5px', color: '#4b5563' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section style={{ padding: '0 4rem 80px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: '1.5rem', fontWeight: 700, color: '#0a143c', marginBottom: '32px' }}>Disclosure Documents</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {MPD_DOCS.map(({ category, items }) => (
              <div key={category} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ background: '#0a143c', padding: '14px 20px' }}>
                  <h3 style={{ color: '#f59e0b', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{category}</h3>
                </div>
                {items.map(({ title, file }, i) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < items.length - 1 ? '1px solid #f3f4f6' : 'none', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '13.5px', color: '#374151', fontWeight: 500 }}>{title}</span>
                    </div>
                    {file ? (
                      <a href={file} target="_blank" rel="noreferrer" download
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#eff6ff', color: '#1d4ed8', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        <Download size={13} /> Download
                      </a>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#d1d5db', fontStyle: 'italic', flexShrink: 0 }}>Upload pending</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Upload note for admin */}
          <div style={{ marginTop: '32px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '14px', padding: '20px 24px', display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>📁</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', color: '#15803d', marginBottom: '4px' }}>For Admin</p>
              <p style={{ fontSize: '13px', color: '#166534', lineHeight: 1.7 }}>
                Upload PDF files to <code style={{ background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>backend/uploads/mpd/</code> and update the <code style={{ background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>file</code> field in the MPD_DOCS array with the correct path, e.g. <code style={{ background: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>/uploads/mpd/affiliation.pdf</code>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
