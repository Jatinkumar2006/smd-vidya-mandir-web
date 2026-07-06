import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, XCircle, Clock, Eye, Trash2, Filter } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }

const STATUS_CONFIG = {
  pending:  { color: '#f59e0b', bg: '#fff8ed', icon: Clock,        label: 'Pending'  },
  approved: { color: '#10b981', bg: '#ecfdf5', icon: CheckCircle,  label: 'Approved' },
  rejected: { color: '#ef4444', bg: '#fef2f2', icon: XCircle,      label: 'Rejected' },
}

export default function AdminAdmissions() {
  const [apps, setApps]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [filterStatus, setFilter]   = useState('')
  const [selected, setSelected]     = useState(null)
  const [updating, setUpdating]     = useState(null)

  const load = async () => {
    try {
      const params = filterStatus ? `?status=${filterStatus}` : ''
      const { data } = await api.get(`/admissions${params}`)
      setApps(data)
    } catch { toast.error('Failed to load applications') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filterStatus])

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      await api.put(`/admissions/${id}/status`, { status })
      toast.success(`Application ${status}!`)
      load()
      if (selected?.id === id) setSelected({ ...selected, status })
    } catch { toast.error('Failed to update status') }
    finally { setUpdating(null) }
  }

  const deleteApp = async (id) => {
    try {
      await api.delete(`/admissions/${id}`)
      toast.success('Application deleted')
      setSelected(null); load()
    } catch { toast.error('Delete failed') }
  }

  const counts = { all: apps.length, ...Object.fromEntries(['pending','approved','rejected'].map(s => [s, apps.filter(a => a.status === s).length])) }

  return (
    <>
      <Helmet><title>Admissions – Admin – SMD Vidya Mandir</title></Helmet>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy }}>Admission Applications</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ val: '', label: `All (${counts.all})` }, { val: 'pending', label: `Pending (${counts.pending})` }, { val: 'approved', label: `Approved (${counts.approved})` }, { val: 'rejected', label: `Rejected (${counts.rejected})` }].map(({ val, label }) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${filterStatus === val ? C.navy : C.border}`,
              background: filterStatus === val ? C.navy : C.white, color: filterStatus === val ? C.white : C.muted,
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.5rem' }}>
        {/* Table */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {['Student', 'Class', 'Parent / Phone', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: C.muted }}>Loading...</td></tr>
                : apps.length === 0
                  ? <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: C.muted }}>No applications found.</td></tr>
                  : apps.map((a, i) => {
                    const cfg = STATUS_CONFIG[a.status]
                    return (
                      <tr key={a.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : '#fafbff', cursor: 'pointer' }}
                        onClick={() => setSelected(selected?.id === a.id ? null : a)}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{a.student_name}</td>
                        <td style={{ padding: '12px 16px' }}>Class {a.class_applying}</td>
                        <td style={{ padding: '12px 16px', color: C.muted }}>{a.parent_name}<br /><span style={{ fontSize: 12 }}>{a.phone}</span></td>
                        <td style={{ padding: '12px 16px', color: C.muted, fontSize: 12 }}>{new Date(a.created_at).toLocaleDateString('en-IN')}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {cfg.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={e => { e.stopPropagation(); deleteApp(a.id) }} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, color: C.navy }}>Application Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.muted }}>✕</button>
            </div>
            {[
              ['Student Name', selected.student_name],
              ['Date of Birth', selected.dob ? new Date(selected.dob).toLocaleDateString('en-IN') : '-'],
              ['Gender', selected.gender || '-'],
              ['Class Applying', `Class ${selected.class_applying}`],
              ['Parent Name', selected.parent_name],
              ['Relation', selected.relation || '-'],
              ['Phone', selected.phone],
              ['Email', selected.email || '-'],
              ['Address', selected.address || '-'],
              ['Applied On', new Date(selected.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
            ].map(([l, v]) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
                <p style={{ fontSize: 14, color: C.text, marginTop: 2 }}>{v}</p>
              </div>
            ))}
            {selected.status === 'pending' && (
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={() => updateStatus(selected.id, 'approved')} disabled={updating === selected.id}
                  style={{ flex: 1, background: '#10b981', color: C.white, fontWeight: 700, fontSize: 14, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <CheckCircle size={16} /> Approve
                </button>
                <button onClick={() => updateStatus(selected.id, 'rejected')} disabled={updating === selected.id}
                  style={{ flex: 1, background: '#ef4444', color: C.white, fontWeight: 700, fontSize: 14, padding: '11px', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <XCircle size={16} /> Reject
                </button>
              </div>
            )}
            {selected.status !== 'pending' && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: STATUS_CONFIG[selected.status].bg, borderRadius: 10, textAlign: 'center' }}>
                <span style={{ color: STATUS_CONFIG[selected.status].color, fontWeight: 700 }}>
                  Application {STATUS_CONFIG[selected.status].label}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
