import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, GraduationCap, Users, Heart, ArrowRight, X, Upload, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import api from '@/services/api'
import VanillaTilt from 'vanilla-tilt'

const benefits = [
  { icon: GraduationCap, title: 'Professional Growth', desc: 'Continuous training and workshops to enhance teaching methodologies.' },
  { icon: Users,         title: 'Collaborative Culture', desc: 'Work with a supportive team of passionate educators and staff.' },
  { icon: Heart,         title: 'Work-Life Balance', desc: 'Healthy environment that respects personal time and well-being.' },
  { icon: Briefcase,     title: 'Competitive Package', desc: 'Attractive salary and benefits commensurate with experience.' },
]

export default function Careers() {
  const [openings, setOpenings] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({ applicant_name: '', email: '', phone: '', experience: '', expYears: '', expMonths: '' })
  const [resumeFile, setResumeFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    fetchCareers()
  }, [])

  useEffect(() => {
    const featureCards = document.querySelectorAll('.feature-card')
    if (featureCards.length > 0) {
      VanillaTilt.init(featureCards, {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.4,
        scale: 1.05,
      })
    }
    return () => {
      featureCards.forEach(card => {
        if (card.vanillaTilt) card.vanillaTilt.destroy()
      })
    }
  }, [])

  const fetchCareers = async () => {
    try {
      const { data } = await api.get('/careers')
      setOpenings(data)
    } catch (err) {
      console.error('Failed to load careers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyClick = (job) => {
    setSelectedJob(job)
    setShowModal(true)
    setSubmitSuccess(false)
    setShowConfirm(false)
    setFormData({ applicant_name: '', email: '', phone: '', experience: '', expYears: '', expMonths: '' })
    setResumeFile(null)
  }

  const handleInitialSubmit = (e) => {
    e.preventDefault()
    if (!resumeFile) return alert('Please upload your resume.')
    setShowConfirm(true) // Open confirmation before payment
  }

  const handlePaymentAndSubmit = async () => {
    setShowConfirm(false)
    setIsSubmitting(true)
    
    try {
      // 1. Create Razorpay Order
      const { data: order } = await api.post('/payments/create-order')

      // 2. Initialize Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
        amount: order.amount,
        currency: order.currency,
        name: 'SMD Vidya Mandir',
        description: `Application Fee for ${selectedJob.title}`,
        order_id: order.id,
        handler: async function (response) {
          // 3. On successful payment, submit the actual application
          try {
            const submitData = new FormData()
            submitData.append('applicant_name', formData.applicant_name)
            submitData.append('email', formData.email)
            submitData.append('phone', formData.phone)
            submitData.append('experience', formData.experience)
            submitData.append('resume', resumeFile)
            
            submitData.append('razorpay_payment_id', response.razorpay_payment_id)
            submitData.append('razorpay_order_id', response.razorpay_order_id)
            submitData.append('razorpay_signature', response.razorpay_signature)

            await api.post(`/careers/${selectedJob.id}/apply`, submitData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            
            setSubmitSuccess(true)
            setTimeout(() => setShowModal(false), 5000)
          } catch (err) {
            alert('Application submission failed after payment. Please contact support.')
          } finally {
            setIsSubmitting(false)
          }
        },
        prefill: {
          name: formData.applicant_name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#1e3a8a' // smd-blue
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response){
        alert('Payment failed! Reason: ' + response.error.description)
        setIsSubmitting(false)
      })
      rzp.open()
      
    } catch (err) {
      alert('Failed to initialize payment. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <PageHeader 
        title="Careers at SMD" 
        subtitle="Join our dedicated team of educators and staff shaping the future."
        badge="Join Our Team"
      />

      <div className="container-max section-padding">
        
        {/* Why Join Us */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-smd-blue mb-4">Why Join SMD Vidya Mandir?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We are always looking for passionate, innovative, and dedicated individuals to join our mission of providing holistic education.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="feature-card"
                style={{ background: '#fff', borderRadius: '16px', padding: '28px 22px', border: '1px solid #e5e7eb', textAlign: 'center', transition: 'box-shadow 0.25s, border-color 0.25s, transform 0.25s ease-out', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 50px rgba(10,20,60,0.15)'; e.currentTarget.style.borderColor = '#c7d9ff'; e.currentTarget.style.transform = 'translateY(-6px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ width: '58px', height: '58px', borderRadius: '15px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <b.icon size={26} color="#1d4ed8" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0a143c', marginBottom: '8px' }}>{b.title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65 }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Current Vacancies */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-smd-blue mb-2">Current Openings</h2>
              <p className="text-slate-600">Discover your next career opportunity with us.</p>
            </div>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-500 text-center py-8">Loading available positions...</p>
            ) : openings.length === 0 ? (
              <p className="text-slate-500 text-center bg-white p-8 rounded-xl border border-slate-200">No open positions at the moment. Please check back later.</p>
            ) : (
              openings.map((job, i) => (
                <motion.div 
                  key={job.id} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-smd-blue transition-colors duration-300"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-smd-blue transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{job.department}</span>
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{job.type}</span>
                      <span className="bg-slate-100 px-3 py-1 rounded-full">Exp: {job.experience}</span>
                    </div>
                    {job.description && <p className="mt-3 text-slate-600 text-sm max-w-2xl">{job.description}</p>}
                  </div>
                  <button onClick={() => handleApplyClick(job)} className="shrink-0 bg-smd-blue text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                    Apply Now <ArrowRight size={16} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* How to Apply / General */}
        <section className="bg-smd-blue text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-smd-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Don't see a matching role?</h2>
            <p className="text-blue-100 mb-8 leading-relaxed">
              We are always open to hearing from talented individuals. Send us your resume and a brief cover letter detailing how you can contribute to our school community.
            </p>
            <a href="mailto:smdvidyamandir@gmail.com?subject=General Career Inquiry" className="inline-block bg-smd-gold text-white font-bold px-8 py-3 rounded-lg hover:bg-yellow-600 transition-colors shadow-lg shadow-smd-gold/30">
              Email Your Resume
            </a>
          </div>
        </section>

      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {showModal && selectedJob && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Apply for Position</h3>
                  <p className="text-sm text-smd-blue font-medium mt-1">{selectedJob.title}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm"><X size={20} /></button>
              </div>

              {submitSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Application & Payment Successful!</h4>
                  <p className="text-slate-600 mb-4">Thank you for your interest. Our HR team will review your profile.</p>
                  {formData.email && (
                    <p className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium border border-green-200">
                      ✉️ A confirmation receipt has been sent to {formData.email}
                    </p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleInitialSubmit} className="p-6 space-y-5 relative">
                  
                  {/* OVERLAY: Confirmation Step */}
                  <AnimatePresence>
                    {showConfirm && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-0 bg-white/95 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center"
                      >
                        <div className="text-amber-500 bg-amber-50 p-4 rounded-full mb-4">
                          <AlertTriangle size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 mb-2">Verify Your Details</h4>
                        <p className="text-slate-600 text-sm mb-6">This submission is non-editable. Are you sure all provided details are completely accurate?</p>
                        
                        <div className="flex gap-3 w-full">
                          <button type="button" onClick={() => setShowConfirm(false)} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200">Let me re-check</button>
                          <button type="button" onClick={handlePaymentAndSubmit} className="flex-1 bg-smd-blue text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-800">
                            <ShieldCheck size={18} /> Pay ₹100 & Submit
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue" placeholder="Jatin Kumar Soni" value={formData.applicant_name} onChange={e => setFormData({...formData, applicant_name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input required type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue" placeholder="example@gmail.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input required type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue" placeholder="+91 90239035XX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Experience</label>
                    <div className="flex gap-4">
                      <select required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue" value={formData.expYears} onChange={e => setFormData({...formData, expYears: e.target.value, experience: `${e.target.value} Years, ${formData.expMonths || '0'} Months`})}>
                        <option value="" disabled>Years</option>
                        {[...Array(41)].map((_, i) => <option key={`y-${i}`} value={i}>{i} {i === 1 ? 'Year' : 'Years'}</option>)}
                      </select>
                      <select required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-smd-blue/20 focus:border-smd-blue" value={formData.expMonths} onChange={e => setFormData({...formData, expMonths: e.target.value, experience: `${formData.expYears || '0'} Years, ${e.target.value} Months`})}>
                        <option value="" disabled>Months</option>
                        {[...Array(12)].map((_, i) => <option key={`m-${i}`} value={i}>{i} {i === 1 ? 'Month' : 'Months'}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Upload Resume (PDF only)</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        required 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={e => setResumeFile(e.target.files[0])}
                      />
                      <Upload size={24} className={resumeFile ? "text-smd-blue mb-2" : "text-slate-400 mb-2"} />
                      <p className="text-sm font-medium text-slate-700">{resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX up to 5MB</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-smd-blue text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                      {isSubmitting ? 'Processing...' : 'Proceed to Payment (₹100)'} <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
