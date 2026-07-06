import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { X, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
}

const CATEGORIES = ['All', 'Events', 'Sports', 'Cultural', 'Campus']

const GALLERY_ITEMS = [
  { id: 1,  category: 'Events',   title: 'Annual Day 2024',          src: '/gallery/annual-day.png',         desc: 'Students celebrate the Annual Day with vibrant performances and prize distribution.' },
  { id: 2,  category: 'Sports',   title: 'Sports Day 2024',          src: '/gallery/sports-day.png',         desc: 'Annual Sports Day featuring track events, team sports and athletics.' },
  { id: 3,  category: 'Cultural', title: 'Republic Day Celebration', src: '/gallery/republic-day.png',       desc: 'Proud moments as students honor Republic Day with flag hoisting and march past.' },
  { id: 4,  category: 'Campus',   title: 'Digital Classrooms',       src: '/gallery/classroom.png',          desc: 'State-of-the-art classrooms equipped with projectors and digital boards.' },
  { id: 5,  category: 'Campus',   title: 'Science Laboratory',       src: '/gallery/science-lab.png',        desc: 'Well-equipped science labs where students explore and experiment.' },
  { id: 6,  category: 'Sports',   title: 'Cricket Tournament',       src: '/gallery/cricket.png',            desc: 'Inter-class cricket tournament played on the school grounds.' },
  { id: 7,  category: 'Cultural', title: 'Cultural Program',         src: '/gallery/cultural.png',           desc: 'Rajasthani folk dance performance at the annual cultural evening.' },
  { id: 8,  category: 'Campus',   title: 'School Library',           src: '/gallery/library.png',            desc: 'Our well-stocked library with thousands of books across all subjects.' },
  { id: 9,  category: 'Events',   title: 'Prize Distribution',       src: '/gallery/prize-distribution.png', desc: 'Recognizing academic excellence and extra-curricular achievements.' },
]

// ── Component ─────────────────────────────────────────────

/**
 * Gallery Page Component.
 * Displays a photo gallery with category filtering.
 * Features an interactive lightbox for viewing images in full screen
 * and utilizes framer-motion for smooth transition animations when filtering.
 */
export default function Gallery() {
  // ── State Management ──
  // selectedCategory tracks the currently active filter category (e.g. 'All', 'Events')
  const [active, setActive]     = useState('All')
  
  // lightbox tracks the currently selected image object to display in full screen, null if closed
  const [lightbox, setLightbox] = useState(null)
  
  // hoveredId tracks which image ID is currently being hovered to apply zoom/overlay effects
  const [hoveredId, setHoveredId] = useState(null)

  const filtered = active === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.category === active)

  return (
    <>
      <Helmet>
        <title>Gallery – SMD Vidya Mandir</title>
        <meta name="description" content="Photo gallery of SMD School events, sports day, cultural programs and campus life at Raghunathgarh, Sikar." />
      </Helmet>

      {/* Header */}
      <div className="responsive-header relative overflow-hidden" style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)' }}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <motion.p variants={itemVariants} style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Memories</motion.p>
          <motion.h1 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Photo Gallery</motion.h1>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.75 }}>
            Glimpses of life at SMD School - events, sports, cultural programs and everyday campus moments.
          </motion.p>
        </motion.div>
      </div>

      {/* Filters */}
      <section className="responsive-section-top" style={{ background: '#f7f9ff', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding: '9px 22px', borderRadius: '100px', fontSize: '13.5px', fontWeight: 600,
                border: active === cat ? 'none' : '1.5px solid #e5e7eb',
                background: active === cat ? '#0a143c' : '#fff',
                color: active === cat ? '#f59e0b' : '#6b7280',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: active === cat ? '0 4px 14px rgba(10,20,60,0.25)' : 'none',
              }}>
                {cat}
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>
                  ({cat === 'All' ? GALLERY_ITEMS.length : GALLERY_ITEMS.filter(i => i.category === cat).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="responsive-section-bottom" style={{ background: '#f7f9ff' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="responsive-grid-3"
          >
            <AnimatePresence>
              {filtered.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  aspectRatio: index % 5 === 0 ? '16/10' : '4/3',
                  gridColumn: index % 5 === 0 ? 'span 2' : 'span 1',
                  boxShadow: hoveredId === item.id ? '0 20px 50px rgba(10,20,60,0.2)' : '0 2px 12px rgba(10,20,60,0.08)',
                  transform: hoveredId === item.id ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                {/* Image */}
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />

                {/* Hover Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: hoveredId === item.id ? 'linear-gradient(to top, rgba(10,20,60,0.85) 0%, rgba(10,20,60,0.1) 60%)' : 'linear-gradient(to top, rgba(10,20,60,0.4) 0%, transparent 50%)',
                  transition: 'background 0.3s ease',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: '#f59e0b', background: 'rgba(245,158,11,0.15)', padding: '3px 10px', borderRadius: 20, marginBottom: 6, display: 'inline-block',
                      }}>
                        {item.category}
                      </span>
                      <p style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginTop: 4, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{item.title}</p>
                    </div>
                    {hoveredId === item.id && (
                      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ZoomIn size={18} color="#fff" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <p style={{ fontSize: '16px' }}>No items in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '20px', right: '24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
          >
            <X size={20} />
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '820px', width: '100%', animation: 'fadeIn 0.25s ease' }}>
            <img
              src={lightbox.src}
              alt={lightbox.title}
              style={{ width: '100%', borderRadius: '18px', display: 'block', maxHeight: '70vh', objectFit: 'cover', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
            />
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f59e0b' }}>{lightbox.category}</span>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginTop: 4 }}>{lightbox.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 6 }}>{lightbox.desc}</p>
            </div>
          </div>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
      )}
    </>
  )
}
