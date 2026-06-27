import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { X } from 'lucide-react'

const CATEGORIES = ['All', 'Events', 'Sports', 'Cultural', 'Campus']

// Placeholder gallery items — replace src with real image imports later
const GALLERY_ITEMS = [
  { id: 1, category: 'Events',   title: 'Annual Day 2024',          color: '#dbeafe' },
  { id: 2, category: 'Sports',   title: 'Sports Day 2024',          color: '#dcfce7' },
  { id: 3, category: 'Cultural', title: 'Republic Day Celebration', color: '#fef9c3' },
  { id: 4, category: 'Campus',   title: 'School Building',          color: '#ede9fe' },
  { id: 5, category: 'Events',   title: 'Science Exhibition',       color: '#fce7f3' },
  { id: 6, category: 'Sports',   title: 'Cricket Tournament',       color: '#dcfce7' },
  { id: 7, category: 'Cultural', title: 'Independence Day',         color: '#fef9c3' },
  { id: 8, category: 'Campus',   title: 'Library',                  color: '#ede9fe' },
  { id: 9, category: 'Events',   title: 'Prize Distribution',       color: '#dbeafe' },
  { id: 10, category: 'Sports',  title: 'Kabaddi Match',            color: '#dcfce7' },
  { id: 11, category: 'Cultural','title': 'Cultural Program',       color: '#fce7f3' },
  { id: 12, category: 'Campus',  title: 'Playground',               color: '#ede9fe' },
]

export default function Gallery() {
  const [active, setActive]   = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const filtered = active === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.category === active)

  return (
    <>
      <Helmet>
        <title>Gallery – SMD Digital Campus</title>
        <meta name="description" content="Photo gallery of SMD School events, sports day, cultural programs and campus life." />
      </Helmet>

      {/* Header */}
      <div style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)', padding: '100px 4rem 60px', marginTop: '70px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <p style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Memories</p>
          <h1 style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Photo Gallery</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.75 }}>
            Glimpses of life at SMD School — events, sports, cultural programs and everyday campus moments.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <section style={{ padding: '40px 4rem 0' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding: '8px 20px', borderRadius: '100px', fontSize: '13.5px', fontWeight: 600,
                border: active === cat ? 'none' : '1.5px solid #e5e7eb',
                background: active === cat ? '#0a143c' : '#fff',
                color: active === cat ? '#f59e0b' : '#6b7280',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '40px 4rem 80px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
            {filtered.map(item => (
              <div key={item.id} onClick={() => setLightbox(item)}
                style={{ borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', background: item.color, aspectRatio: '4/3', position: 'relative', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,20,60,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Placeholder — replace with <img src={item.src} /> when you have real photos */}
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '36px' }}>🏫</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', textAlign: 'center', padding: '0 12px' }}>{item.title}</span>
                </div>
                {/* Hover overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,20,60,0)', transition: 'background 0.25s', display: 'flex', alignItems: 'flex-end', padding: '12px' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,20,60,0.45)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,20,60,0)'}
                >
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600, opacity: 0 }}>{item.title}</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <p style={{ fontSize: '16px' }}>No items in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Note for real photos */}
      <div style={{ background: '#fff8ed', borderTop: '1px solid #fed7aa', padding: '16px 4rem', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#92400e' }}>
          📸 Gallery images will be managed dynamically from the Admin Panel once photos are uploaded.
        </p>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '20px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
          <div style={{ background: lightbox.color, borderRadius: '18px', padding: '60px 80px', textAlign: 'center' }}>
            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🏫</span>
            <p style={{ fontWeight: 700, fontSize: '18px', color: '#0a143c' }}>{lightbox.title}</p>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>{lightbox.category}</p>
          </div>
        </div>
      )}
    </>
  )
}
