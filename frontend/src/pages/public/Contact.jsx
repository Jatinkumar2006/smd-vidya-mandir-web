import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Phone, Mail, MapPin, Clock, Youtube, Facebook } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent! We\'ll get back to you soon.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      toast.error('Failed to send. Please call us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us – SMD Digital Campus</title>
        <meta name="description" content="Contact SMD School Sikar — phone, email, address, and online inquiry form." />
      </Helmet>

      {/* Header */}
      <div style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)', padding: '100px 4rem 60px', marginTop: '70px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <p style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Get in Touch</p>
          <h1 style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.75 }}>
            We'd love to hear from you. Reach out for admissions, general inquiries or to schedule a campus visit.
          </p>
        </div>
      </div>

      <section style={{ padding: '80px 4rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '48px' }}>

          {/* Left — Contact Info */}
          <div>
            <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: '1.6rem', fontWeight: 700, color: '#0a143c', marginBottom: '28px' }}>School Information</h2>

            {[
              { icon: MapPin, label: 'Address',    value: 'Khori Brahmanan, Raghunathgarh,\nSikar, Rajasthan – 332001', href: 'https://maps.google.com/?q=SMD+School+Sikar' },
              { icon: Phone,  label: 'Phone',      value: '+91-9001995272',           href: 'tel:+919001995272' },
              { icon: Mail,   label: 'Email',      value: 'smdvidyamandir@gmail.com', href: 'mailto:smdvidyamandir@gmail.com' },
              { icon: Clock,  label: 'School Hours', value: 'Mon – Sat: 7:30 AM – 2:00 PM\nSunday: Closed', href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color="#1d4ed8" />
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f59e0b', marginBottom: '4px' }}>{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                      style={{ fontSize: '14.5px', color: '#0a143c', textDecoration: 'none', lineHeight: 1.6, whiteSpace: 'pre-line', fontWeight: 500 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#1d4ed8'}
                      onMouseLeave={e => e.currentTarget.style.color = '#0a143c'}
                    >{value}</a>
                  ) : (
                    <p style={{ fontSize: '14.5px', color: '#4b5563', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '14px' }}>Follow Us</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href="https://www.youtube.com/@SMDsikar" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', color: '#dc2626', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                  <Youtube size={16} /> YouTube
                </a>
                <a href="https://www.facebook.com/SMDVidyaMandirCBSE/" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#dbeafe', color: '#1d4ed8', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                  <Facebook size={16} /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Right — Inquiry Form */}
          <div style={{ background: '#f7f9ff', borderRadius: '20px', padding: '40px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: '1.4rem', fontWeight: 700, color: '#0a143c', marginBottom: '6px' }}>Send us a Message</h2>
            <p style={{ color: '#6b7280', fontSize: '13.5px', marginBottom: '28px' }}>We typically respond within 24 hours on working days.</p>

            <form onSubmit={submit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Name *</label>
                  <input name="name" value={form.name} onChange={handle} required placeholder="Ramesh Kumar"
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#0a143c'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="+91 9876543210" type="tel"
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#0a143c'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                <input name="email" value={form.email} onChange={handle} placeholder="you@example.com" type="email"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#0a143c'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject *</label>
                <select name="subject" value={form.subject} onChange={handle} required
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box', color: form.subject ? '#111' : '#9ca3af' }}
                  onFocus={e => e.target.style.borderColor = '#0a143c'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Select a subject...</option>
                  <option>Admission Inquiry</option>
                  <option>Fee Structure</option>
                  <option>Transport Information</option>
                  <option>Academic Query</option>
                  <option>General Inquiry</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message *</label>
                <textarea name="message" value={form.message} onChange={handle} required placeholder="Write your message here..." rows={4}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#0a143c'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#9ca3af' : '#f59e0b', color: '#0a143c', fontWeight: 700, fontSize: '14px', padding: '14px', borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section style={{ padding: '0 4rem 80px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid #e5e7eb', height: '320px', background: '#f7f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <MapPin size={40} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px' }}>Khori Brahmanan, Raghunathgarh, Sikar, Rajasthan</p>
              <a href="https://maps.google.com/?q=Raghunathgarh+Sikar+Rajasthan" target="_blank" rel="noreferrer"
                style={{ background: '#0a143c', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
