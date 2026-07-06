import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Users, FileText, Bell, Image, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import api from '@/services/api'

const C = {
  navy: '#0a143c', gold: '#f59e0b', white: '#ffffff',
  bg: '#f7f9ff', border: '#e5e7eb',
  text: '#0a143c', muted: '#6b7280', body: '#4b5563',
}

export default function AdminDashboard() {
  const [stats, setStats]     = useState({ total_students: 0, pending_admissions: 0, active_notices: 0, gallery_items: 0 })
  const [notices, setNotices] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, noticesRes, admRes] = await Promise.all([
          api.get('/students/stats'),
          api.get('/notices'),
          api.get('/admissions'),
        ])
        setStats(statsRes.data)
        setNotices(noticesRes.data.slice(0, 3))
        setAdmissions(admRes.data.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const STAT_CARDS = [
    { label: 'Total Students',     value: stats.total_students,     icon: Users,     color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Pending Admissions', value: stats.pending_admissions, icon: Clock,      color: '#f59e0b', bg: '#fff8ed' },
    { label: 'Active Notices',     value: stats.active_notices,     icon: Bell,       color: '#10b981', bg: '#ecfdf5' },
    { label: 'Gallery Items',      value: stats.gallery_items,      icon: Image,      color: '#8b5cf6', bg: '#f5f3ff' },
  ]

  const statusColors = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444' }
  const statusBg     = { pending: '#fff8ed', approved: '#ecfdf5', rejected: '#fef2f2' }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: `4px solid ${C.border}`, borderTopColor: C.navy,
          borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: C.muted }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <>
      <Helmet><title>Admin Dashboard – SMD Vidya Mandir</title></Helmet>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy, marginBottom: '1.5rem' }}>
        Dashboard Overview
      </h1>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{
            background: C.white, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: '22px 20px', display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ background: bg, borderRadius: 12, padding: 12, flexShrink: 0 }}>
              <Icon size={24} color={color} />
            </div>
            <div>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: C.navy, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '0.78rem', color: C.muted, marginTop: 4 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Admissions */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <FileText size={18} color={C.navy} />
            <h2 style={{ fontWeight: 700, color: C.navy, fontSize: '1rem' }}>Recent Admissions</h2>
          </div>
          {admissions.length === 0
            ? <p style={{ color: C.muted, fontSize: 14 }}>No applications yet.</p>
            : admissions.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: `1px solid ${C.border}`,
              }}>
                <div>
                  <p style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{a.student_name}</p>
                  <p style={{ color: C.muted, fontSize: 12 }}>Class {a.class_applying} · {a.phone}</p>
                </div>
                <span style={{
                  background: statusBg[a.status], color: statusColors[a.status],
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {a.status}
                </span>
              </div>
            ))
          }
        </div>

        {/* Recent Notices */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Bell size={18} color={C.navy} />
            <h2 style={{ fontWeight: 700, color: C.navy, fontSize: '1rem' }}>Recent Notices</h2>
          </div>
          {notices.length === 0
            ? <p style={{ color: C.muted, fontSize: 14 }}>No notices yet.</p>
            : notices.map(n => (
              <div key={n.id} style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                <p style={{ fontWeight: 600, color: C.text, fontSize: 14 }}>{n.title}</p>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>
                  {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}
