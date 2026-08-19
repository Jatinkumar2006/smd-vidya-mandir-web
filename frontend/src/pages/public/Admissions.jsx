import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/services/api'
import toast from 'react-hot-toast'

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

const STEPS = [
  { n: '01', title: 'Fill Online Form',    desc: 'Complete the admission inquiry form below with student and parent details.' },
  { n: '02', title: 'School Review',       desc: 'Our team reviews your application and contacts you within 2 working days.' },
  { n: '03', title: 'Visit & Interaction', desc: 'Visit the campus for a brief interaction and document verification.' },
  { n: '04', title: 'Confirmation',        desc: 'Receive your admission confirmation and fee payment details.' },
]

const DOCS = [
  'Birth Certificate of the student',
  'Previous class mark sheet / Transfer Certificate',
  'Aadhar Card of student and parent',
  '4 passport-size photographs',
  'Residential address proof',
  'Caste certificate (if applicable)',
]

export default function Admissions() {
  const [form, setForm] = useState({
    student_name: '', dob: '', gender: '', class_applying: '',
    parent_name: '', relation: 'Father', phone: '', email: '', address: '',
  })
  
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleInitialSubmit = (e) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const confirmAndSubmit = async () => {
    setShowConfirm(false)
    setLoading(true)
    try {
      await api.post('/admissions', form)
      setSubmitted(true)
      toast.success('Application submitted successfully!')
    } catch {
      toast.error('Submission failed. Please try again or call us.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' }
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <>
      <Helmet>
        <title>Admissions – SMD Vidya Mandir</title>
        <meta name="description" content="Apply online for admission to SMD School Sikar. CBSE classes I to XII. Admissions open 2025–26." />
      </Helmet>

      {/* Header */}
      <div className="responsive-header relative overflow-hidden" style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)' }}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <motion.p variants={itemVariants} style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>2025–26</motion.p>
          <motion.h1 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Admissions Open</motion.h1>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.75 }}>
            Apply online for Classes I – XII. Seats are limited - secure your child's admission today.
          </motion.p>
        </motion.div>
      </div>

      {/* Process Steps */}
      <section className="responsive-section" style={{ background: '#f7f9ff' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <motion.p variants={itemVariants} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>How It Works</motion.p>
            <motion.h2 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.7rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0a143c' }}>Admission Process</motion.h2>
          </div>
          <div className="responsive-grid-4">
            {STEPS.map(({ n, title, desc }) => (
              <motion.div variants={itemVariants} key={n} style={{ position: 'relative' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px 22px', height: '100%' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#e5e7eb', marginBottom: '12px', fontFamily: 'monospace' }}>{n}</div>
                  <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0a143c', marginBottom: '8px' }}>{title}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65 }}>{desc}</p>
                </div>
                <div style={{ position: 'absolute', top: '-1px', left: '-1px', width: '4px', height: '60%', background: '#f59e0b', borderRadius: '4px 0 0 4px' }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Form + Docs */}
      <section className="responsive-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="responsive-admission-grid" style={{ maxWidth: '1160px', margin: '0 auto' }}>

          {/* Form */}
          <motion.div variants={itemVariants}>
            <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: '1.6rem', fontWeight: 700, color: '#0a143c', marginBottom: '6px' }}>Online Admission Form</h2>
            <p style={{ color: '#6b7280', fontSize: '13.5px', marginBottom: '32px' }}>Fill in the details below. Fields marked * are required.</p>

            {submitted ? (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
                <CheckCircle size={52} color="#16a34a" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: "'Merriweather',serif", fontSize: '1.4rem', fontWeight: 700, color: '#15803d', marginBottom: '10px' }}>Application Submitted!</h3>
                <p style={{ color: '#166534', fontSize: '15px', lineHeight: 1.7, marginBottom: '8px' }}>
                  Thank you! We have received your application for <strong>{form.student_name || 'your child'}</strong>.
                </p>
                {form.email && (
                  <p style={{ color: '#15803d', fontSize: '14px', fontWeight: 500, background: '#dcfce7', display: 'inline-block', padding: '6px 12px', borderRadius: '8px', marginBottom: '16px' }}>
                    ✉️ A copy of your response has been sent to {form.email}
                  </p>
                )}
                <p style={{ color: '#166534', fontSize: '15px', lineHeight: 1.7 }}>
                  Our team will contact you on <strong>{form.phone}</strong> within 2 working days.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ student_name:'',dob:'',gender:'',class_applying:'',parent_name:'',relation:'Father',phone:'',email:'',address:'' }) }}
                  style={{ marginTop: '24px', background: '#16a34a', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleInitialSubmit}>
                {/* Student Details */}
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f59e0b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Student Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label style={labelStyle}>Student Name *</label>
                      <input name="student_name" value={form.student_name} onChange={handle} required placeholder="Jatin Kumar Soni" style={inputStyle} onFocus={e => e.target.style.borderColor='#0a143c'} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Date of Birth *</label>
                      <input name="dob" value={form.dob} onChange={handle} required type="date" style={inputStyle} onFocus={e => e.target.style.borderColor='#0a143c'} onBlur={e => e.target.style.borderColor='#e5e7eb'} onClick={e => {try { e.target.showPicker() } catch(err) {}}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label style={labelStyle}>Gender *</label>
                      <select name="gender" value={form.gender} onChange={handle} required style={inputStyle} onFocus={e => e.target.style.borderColor='#0a143c'} onBlur={e => e.target.style.borderColor='#e5e7eb'}>
                        <option value="">Select...</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Applying for Class *</label>
                      <select name="class_applying" value={form.class_applying} onChange={handle} required style={inputStyle} onFocus={e => e.target.style.borderColor='#0a143c'} onBlur={e => e.target.style.borderColor='#e5e7eb'}>
                        <option value="">Select class...</option>
                        {['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'].map(c => <option key={c}>Class {c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Parent Details */}
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f59e0b', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Parent / Guardian Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label style={labelStyle}>Parent Name *</label>
                      <input name="parent_name" value={form.parent_name} onChange={handle} required placeholder="Jatin Kumar Soni" style={inputStyle} onFocus={e => e.target.style.borderColor='#0a143c'} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Relation *</label>
                      <select name="relation" value={form.relation} onChange={handle} style={inputStyle} onFocus={e => e.target.style.borderColor='#0a143c'} onBlur={e => e.target.style.borderColor='#e5e7eb'}>
                        <option>Father</option><option>Mother</option><option>Guardian</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label style={labelStyle}>Phone Number *</label>
                      <input name="phone" value={form.phone} onChange={handle} required placeholder="+91 90239035XX" type="tel" style={inputStyle} onFocus={e => e.target.style.borderColor='#0a143c'} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input name="email" value={form.email} onChange={handle} placeholder="example@gmail.com" type="email" style={inputStyle} onFocus={e => e.target.style.borderColor='#0a143c'} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Residential Address *</label>
                    <textarea name="address" value={form.address} onChange={handle} required placeholder="Village / Town, District, State" rows={3} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor='#0a143c'} onBlur={e => e.target.style.borderColor='#e5e7eb'} />
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#9ca3af' : '#f59e0b', color: '#0a143c', fontWeight: 700, fontSize: '15px', padding: '15px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? 'Submitting...' : <><span>Submit Application</span><ArrowRight size={18} /></>}
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar - Documents */}
          <motion.div variants={itemVariants} style={{ position: 'sticky', top: '90px' }}>
            <div style={{ background: '#0a143c', borderRadius: '18px', padding: '28px', marginBottom: '20px' }}>
              <h3 style={{ color: '#f59e0b', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>📋 Documents Required</h3>
              {DOCS.map((doc, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px', color: 'rgba(255,255,255,0.82)', fontSize: '13.5px', lineHeight: 1.5 }}>
                  <CheckCircle size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {doc}
                </div>
              ))}
            </div>

            <div style={{ background: '#fff8ed', border: '1.5px solid #fed7aa', borderRadius: '16px', padding: '22px' }}>
              <p style={{ fontWeight: 700, fontSize: '14px', color: '#92400e', marginBottom: '8px' }}>📞 Need Help?</p>
              <p style={{ fontSize: '13px', color: '#78350f', lineHeight: 1.7, marginBottom: '14px' }}>Call us directly and our team will guide you through the admission process.</p>
              <a href="tel:+919001995272" style={{ display: 'block', background: '#f59e0b', color: '#0a143c', fontWeight: 700, fontSize: '14px', padding: '11px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center' }}>
                +91-9001995272
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex gap-4 items-start bg-red-50">
                <div className="text-red-500 bg-red-100 p-2 rounded-full shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Please Verify Your Details</h3>
                  <p className="text-sm text-slate-600 mt-1">This submission is non-editable once confirmed. Are you sure all the provided details are correct?</p>
                </div>
              </div>
              <div className="p-6 bg-slate-50 flex justify-end gap-3">
                <button type="button" onClick={() => setShowConfirm(false)} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 font-medium">
                  Let me re-check
                </button>
                <button type="button" onClick={confirmAndSubmit} disabled={loading} className="px-5 py-2.5 bg-smd-blue text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-70 flex items-center gap-2">
                  {loading ? 'Submitting...' : 'Confirm & Submit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
