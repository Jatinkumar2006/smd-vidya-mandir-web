import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { FileText, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '@/services/api'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }
}

const INITIAL_MPD_DOCS = [
  {
    category: 'General Documents',
    items: [
      { title: 'Academic Calendar', file: null },
      { title: 'Building Safety', file: null },
      { title: 'CBSE - Affiliation', file: '/doc/Cbse-Affiliation.pdf' },
      { title: 'Fee Structure', file: null },
      { title: 'Land Certificate', file: '/doc/Land-Certificate.pdf' },
    ],
  },
  {
    category: 'Certifications & Reports',
    items: [
      { title: 'NOC', file: '/doc/NOC.pdf' },
      { title: 'Recognition', file: '/doc/Recognition.pdf' },
      { title: 'Self Certificate', file: '/doc/Self-Certificate.pdf' },
      { title: 'Society Registration', file: '/doc/Society-Registration.pdf' },
      { title: 'Water-Test-Report', file: '/doc/Water-Test-Report.pdf' },
    ],
  },
]

const INFO_TABLE = [
  { label: 'Name', value: 'Shri Mangalchand Didwaniya Vidya Mandir' },
  { label: 'Affiliate ID', value: '1730539' },
  { label: 'Address', value: 'V.p.o. Khori Brahamnan, Raghunathgarh, Distt. Sikar (raj.)' },
  { label: 'PIN Code', value: '332001' },
  { label: 'STD Code', value: '1572' },
  { label: 'Office Phone', value: '251118' },
  { label: 'Residence Phone', value: '22241840' },
  { label: 'E-mail', value: 'SMDVIDYAMANDIR@GMAIL.COM' },
  { label: 'Foundation Year', value: '2002' },
  { label: 'School Status', value: 'Senior Secondary' },
  { label: 'Managing Trust/Society/Committee', value: 'Shri Khandelwal Charity Trust' },
]

export default function MPD() {
  const [docs, setDocs] = useState(INITIAL_MPD_DOCS)

  useEffect(() => {
    // Fetch dynamic documents from DB and merge them into the static layout
    api.get('/documents').then(res => {
      const dbDocs = res.data
      setDocs(prevDocs => 
        prevDocs.map(category => ({
          ...category,
          items: category.items.map(item => {
            // If the admin uploaded a document with the exact same title, override the file URL
            const matchedDbDoc = dbDocs.find(d => d.title.toLowerCase() === item.title.toLowerCase())
            if (matchedDbDoc) return { ...item, file: matchedDbDoc.file_url }
            return item
          })
        }))
      )
    }).catch(err => console.error("Failed to load documents", err))
  }, [])

  return (
    <>
      <Helmet>
        <title>Mandatory Public Disclosure – SMD Vidya Mandir</title>
        <meta name="description" content="CBSE Mandatory Public Disclosure documents for SMD School Sikar, Rajasthan." />
      </Helmet>

      {/* Header */}
      <div className="responsive-header" style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)' }}>
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <motion.p variants={itemVariants} style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>CBSE Compliance</motion.p>
          <motion.h1 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Mandatory Public Disclosure</motion.h1>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '600px', lineHeight: 1.75 }}>
            As per CBSE guidelines, all affiliated schools are required to publicly disclose the following information and documents.
          </motion.p>
        </motion.div>
      </div>

      {/* CBSE Info notice */}
      <div className="px-4 md:px-16" style={{ background: '#fff8ed', borderBottom: '1px solid #fed7aa', paddingTop: '14px', paddingBottom: '14px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '16px' }}>ℹ️</span>
          <p style={{ fontSize: '13px', color: '#92400e' }}>
            This page is maintained as per <strong>CBSE Affiliation Bye-Laws</strong>. All documents are updated annually.
            For queries, contact us at <a href="mailto:smdvidyamandir@gmail.com" style={{ color: '#0a143c', fontWeight: 600 }}>smdvidyamandir@gmail.com</a>
          </p>
        </div>
      </div>

      {/* School Info Table */}
      <section className="responsive-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <motion.h2 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: '1.5rem', fontWeight: 700, color: '#0a143c', marginBottom: '24px' }}>General School Information</motion.h2>
          <motion.div variants={itemVariants} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
            {INFO_TABLE.map(({ label, value }, i) => (
              <div key={label} className={`grid grid-cols-1 md:grid-cols-[280px_1fr] ${i < INFO_TABLE.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div style={{ padding: '14px 20px', background: i % 2 === 0 ? '#f8faff' : '#fff', fontWeight: 600, fontSize: '13.5px', color: '#374151' }} className="md:border-r border-gray-100">{label}</div>
                <div style={{ padding: '14px 20px', background: i % 2 === 0 ? '#f8faff' : '#fff', fontSize: '13.5px', color: '#4b5563' }}>{value}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Documents */}
      <section className="responsive-section-bottom">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <motion.h2 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: '1.5rem', fontWeight: 700, color: '#0a143c', marginBottom: '32px' }}>Disclosure Documents</motion.h2>
          <div className="responsive-grid-2">
            {docs.map(({ category, items }) => (
              <motion.div variants={itemVariants} key={category} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
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
                      <a href={file} target="_blank" rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#eff6ff', color: '#1d4ed8', padding: '5px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                        <ExternalLink size={13} /> View
                      </a>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#d1d5db', fontStyle: 'italic', flexShrink: 0 }}>Upload pending</span>
                    )}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>

        </motion.div>
      </section>
    </>
  )
}
