import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { X, ZoomIn, ArrowLeft, Download } from 'lucide-react'
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

import api from '@/services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function Gallery() {
  const [activeAlbum, setActiveAlbum] = useState(null)
  const [lightbox, setLightbox]       = useState(null)
  const [hoveredId, setHoveredId]     = useState(null)
  
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/gallery')
        setItems(data)
      } catch (err) {
        toast.error('Failed to load gallery')
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  // Process raw items into Albums grouped by title.
  // Since items are already sorted by sort_order ASC from the backend, 
  // iterating over them in order will keep the albums in the correct sort_order!
  const albumsMap = new Map()
  items.forEach(item => {
    if (!albumsMap.has(item.title)) {
      albumsMap.set(item.title, {
        id: item.title, // using title as unique ID for the folder
        category: item.category,
        title: item.title,
        coverSrc: item.image_url,
        desc: `Album containing photos for ${item.title}`,
        photos: []
      })
    }
    if (item.image_url) {
      albumsMap.get(item.title).photos.push(item.image_url)
    }
  })
  
  const ALBUMS = Array.from(albumsMap.values())

  return (
    <>
      <Helmet>
        <title>Gallery – SMD Vidya Mandir</title>
        <meta name="description" content="Photo gallery and albums of SMD School events, sports day, cultural programs and campus life at Raghunathgarh, Sikar." />
      </Helmet>

      {/* Header */}
      <div className="responsive-header relative overflow-hidden" style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)' }}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <motion.p variants={itemVariants} style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Memories</motion.p>
          <motion.h1 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Photo Gallery</motion.h1>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.75 }}>
            Browse through our photo albums capturing events, sports, cultural programs and everyday campus moments.
          </motion.p>
        </motion.div>
      </div>



      {/* Grid */}
      <section className="responsive-section" style={{ background: '#f7f9ff', minHeight: '60vh' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          
          {loading ? (
            <LoadingSpinner text="Loading Gallery albums..." />
          ) : activeAlbum ? (
            // ── ALBUM VIEW (Photos inside the folder) ──
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button onClick={() => setActiveAlbum(null)} style={{ alignSelf: 'flex-start', background: '#fff', border: '1px solid #e5e7eb', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#374151', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <ArrowLeft size={16} /> Back to Albums
                </button>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a143c' }}>{activeAlbum.title}</h2>
                  <p style={{ fontSize: '15px', color: '#6b7280', marginTop: '6px' }}>{activeAlbum.desc}</p>
                </div>
              </div>

              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-6">
                <AnimatePresence>
                  {activeAlbum.photos.map((photoSrc, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4 }}
                      key={index}
                      onClick={() => setLightbox({ src: photoSrc, title: activeAlbum.title, desc: `Photo ${index + 1}` })}
                      className="break-inside-avoid mb-3 md:mb-6 relative rounded-xl md:rounded-[16px] overflow-hidden cursor-pointer group"
                      style={{
                        boxShadow: '0 2px 12px rgba(10,20,60,0.08)',
                      }}
                    >
                      <img
                        src={photoSrc}
                        alt={`Photo ${index + 1}`}
                        loading="lazy"
                        style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease' }}
                        className="group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                         <div className="opacity-0 group-hover:opacity-100 bg-white/20 p-3 rounded-full backdrop-blur-md transition-opacity">
                            <ZoomIn size={24} color="#fff" />
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            // ── ALBUMS FOLDER VIEW ──
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6"
            >
              <AnimatePresence>
                {ALBUMS.map((item, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    key={item.id}
                    onClick={() => setActiveAlbum(item)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="break-inside-avoid mb-4 md:mb-6 relative rounded-2xl md:rounded-[16px] overflow-hidden cursor-pointer"
                    style={{
                    boxShadow: hoveredId === item.id ? '0 20px 50px rgba(10,20,60,0.2)' : '0 2px 12px rgba(10,20,60,0.08)',
                    transform: hoveredId === item.id ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  {/* Folder Cover Image */}
                  <img
                    src={item.coverSrc}
                    alt={item.title}
                    loading="lazy"
                    style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />

                  {/* Hover Overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: hoveredId === item.id ? 'linear-gradient(to top, rgba(10,20,60,0.9) 0%, rgba(10,20,60,0.2) 60%)' : 'linear-gradient(to top, rgba(10,20,60,0.5) 0%, transparent 60%)',
                    transition: 'background 0.3s ease',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginTop: 4, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{item.title}</p>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2, fontWeight: 500 }}>
                          📁 {item.photos.length} Photos
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && !activeAlbum && ALBUMS.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <p style={{ fontSize: '16px' }}>No albums in this category yet.</p>
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
          <div className="absolute top-4 right-4 md:top-6 md:right-8 flex items-center gap-3 z-50">
            <a
              href={lightbox.src}
              download={`SMD_Gallery_${lightbox.title.replace(/\s+/g, '_')}`}
              target="_blank"
              rel="noreferrer"
              title="Download Image"
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md cursor-pointer text-decoration-none hover:bg-white/20 transition-colors"
            >
              <Download size={20} />
            </a>
            <button
              onClick={() => setLightbox(null)}
              className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md cursor-pointer hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-[820px] px-2 md:px-0" style={{ animation: 'fadeIn 0.25s ease' }}>
            <img
              src={lightbox.src}
              alt={lightbox.title}
              className="w-full rounded-xl md:rounded-2xl block object-contain shadow-2xl"
              style={{ maxHeight: '80vh' }}
            />
            <div className="mt-4 text-center px-4">
              <span className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase text-amber-500">{lightbox.title}</span>
              <p className="text-white/70 text-xs md:text-sm mt-1.5">{lightbox.desc}</p>
            </div>
          </div>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
      )}
    </>
  )
}
