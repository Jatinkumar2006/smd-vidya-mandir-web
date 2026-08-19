import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Phone, ArrowRight, BookOpen, Monitor, Trophy, Zap, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'

import buildingImg from '@/assets/images/building.webp'
import logoImg     from '@/assets/images/logo.webp'
import VanillaTilt from 'vanilla-tilt'
import api from '@/services/api'
import { useSettings } from '@/context/SettingsContext'
import LoadingSpinner from '@/components/common/LoadingSpinner'

// ── Data ─────────────────────────────────────────────────

const parseCount = (str) => {
  if (!str) return { value: '' }
  const match = String(str).match(/^(\d+)(.*)$/)
  if (match) return { end: parseInt(match[1], 10), suffix: match[2] }
  return { value: str }
}

const FEATURES = [
  {
    icon: BookOpen,
    title: 'CBSE Curriculum',
    desc:  'Nationally recognized board with modern syllabus and regular assessments.',
  },
  {
    icon: Monitor,
    title: 'Digital Learning',
    desc:  'Equipped with projectors and digital boards to make lessons more visual and engaging.',
  },
  {
    icon: Trophy,
    title: 'Expert Faculty',
    desc:  '30+ dedicated teachers committed to student success and individual attention.',
  },
  {
    icon: Zap,
    title: 'Sports & Activities',
    desc:  'Well-equipped facilities and extracurriculars for holistic development.',
  },
]

// Removed QUICK_LINKS

// ── Animation Variants ────────────────────────────────────

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.40, ease: [0.25, 0.1, 0.25, 1] } }
}

// ── Component ─────────────────────────────────────────────

/**
 * Home Page Component.
 * Acts as the landing page for the public website.
 * Features a parallax hero section, a dynamic stats counter,
 * and animated feature cards using framer-motion.
 */
export default function Home() {
  const heroBgRef = useRef(null)
  const [notices, setNotices] = useState([])
  const [loadingNotices, setLoadingNotices] = useState(true)
  const [selectedNotice, setSelectedNotice] = useState(null)
  const { settings, loadingSettings } = useSettings()

  const STATS = loadingSettings ? [] : [
    { ...parseCount(settings?.student_count || '500+'), label: 'Students' },
    { ...parseCount(settings?.years_of_excellence || '15+'), label: 'Years of Trust' },
    { ...parseCount(settings?.expert_teachers || '30+'), label: 'Expert Teachers' },
    { value: settings?.classes_offered || 'I - XII', label: 'All Classes' },
  ]

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get('/notices')
        setNotices(data)
      } catch (err) {
        console.error('Failed to load notices:', err)
      } finally {
        setLoadingNotices(false)
      }
    }
    fetchNotices()
  }, [])

  useEffect(() => {
    // 1. Tilt on Hero Background removed as requested

    // 2. Tilt on Feature Cards
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
      VanillaTilt.init(featureCards, {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.4,
        scale: 1.05,
      });
    }

    // Cleanup tilt instances on unmount
    return () => {
      featureCards.forEach(card => {
        if (card.vanillaTilt) card.vanillaTilt.destroy();
      });
    };
  }, []);

  // ── Parallax Scroll Effect ──
  // Translates the hero background image slightly downwards as the user scrolls down,
  // creating a sense of depth and a 3D parallax effect.
  useEffect(() => {
    const handleScroll = () => {
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Helmet>
        <title>SMD Vidya Mandir – Best CBSE School in Sikar, Rajasthan</title>
        <meta
          name="description"
          content="Shri Mangalchand Didwaniya Vidya Mandir – CBSE affiliated school in Raghunathgarh, Sikar. Admissions open for 2025–26."
        />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        style={{ position: 'relative', height: '100vh', minHeight: '600px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
      >
        {/* Parallax background */}
        <div
          ref={heroBgRef}
          className="absolute inset-0 bg-cover bg-[80%_100%] md:bg-[center_25%]"
          style={{
            backgroundImage: `url(${buildingImg})`,
            willChange: 'transform',
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(110deg, rgba(5,10,40,0.90) 0%, rgba(5,10,40,0.75) 45%, rgba(5,10,40,0.35) 100%)',
          }}
        />

        {/* Hero content */}
        <motion.div 
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 px-4 md:px-16 max-w-[700px] mt-60 md:mt-0"
        >

          {/* Badge */}
          <motion.div variants={heroItemVariants} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1px solid rgba(217,119,6,0.5)', background: 'rgba(180,83,9,0.2)',
            color: '#fbbf24', fontSize: '11.5px', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: '100px', marginBottom: '22px',
          }}>
            <span style={{ width: '6px', height: '6px', background: '#d97706', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
            CBSE Affiliated · Est. 2009 · Sikar
          </motion.div>

          {/* Title */}
          <motion.h1 variants={heroItemVariants} className="font-serif text-3xl md:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.18] mb-3">
            Shri Mangalchand
            <span className="text-amber-500 block">Didwaniya Vidya Mandir</span>
          </motion.h1>

          {/* Motto */}
          <motion.p variants={heroItemVariants} className="text-xs md:text-[13.5px] italic text-amber-500/85 mb-4 md:mb-5 tracking-[0.03em]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            "तमसो मा ज्योतिर्गमय" - Lead us from darkness to light
          </motion.p>

          {/* Subtitle */}
          <motion.p variants={heroItemVariants} className="text-sm md:text-[15.5px] text-white/75 leading-relaxed max-w-[500px] mb-6 md:mb-9">
            Nurturing young minds through quality CBSE education, modern infrastructure,
            and values-based learning at Raghunathgarh, Sikar, Rajasthan.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={heroItemVariants} className="flex gap-3 md:gap-4 flex-wrap">
            <Link to="/admissions" style={{
              background: '#f59e0b', color: '#0a143c', fontWeight: 700,
              fontSize: '14px', padding: '13px 28px', borderRadius: '10px',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(245,158,11,0.45)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fbbf24'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Apply for Admission <ArrowRight size={17} />
            </Link>
            <a href="tel:+919001995272" style={{
              border: '1.5px solid rgba(255,255,255,0.38)', color: '#fff', fontWeight: 600,
              fontSize: '14px', padding: '13px 28px', borderRadius: '10px',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s', background: 'transparent',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.65)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.38)' }}
            >
              <Phone size={16} /> Call Us
            </a>
          </motion.div>
        </motion.div>

        {/* ── STATS BAR ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        }}>
          {STATS.map(({ value, end, suffix, label }, i) => (
            <div
              key={label}
              className="p-2 md:p-5 text-center border-t border-white/10"
              style={{
                background: 'rgba(10,20,60,0.95)',
                backdropFilter: 'blur(10px)',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,35,90,0.95)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,20,60,0.95)'}
            >
              <div className="text-lg md:text-[26px] font-extrabold text-amber-500 leading-none">
                {end ? (
                  <CountUp start={Math.max(0, end - 50)} end={end} suffix={suffix} enableScrollSpy scrollSpyOnce duration={2.5} />
                ) : (
                  value
                )}
              </div>
              <div className="text-[9px] md:text-[11px] font-semibold text-white/65 mt-1 md:mt-2 uppercase tracking-[0.05em]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section className="responsive-section">
        <div className="responsive-grid-2" style={{ maxWidth: '1160px', margin: '0 auto', alignItems: 'center' }}>

          {/* Image */}
          <div style={{ position: 'relative' }}>
            <img
              src={buildingImg}
              alt="SMD School Building"
              style={{ width: '100%', height: '400px', objectFit: 'cover', objectPosition: '85% center', borderRadius: '18px', boxShadow: '0 24px 64px rgba(10,20,60,0.16)', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: '-18px', right: '-18px',
              background: '#0a143c', color: '#fff', borderRadius: '14px',
              padding: '18px 22px', textAlign: 'center',
              boxShadow: '0 8px 32px rgba(10,20,60,0.32)',
            }}>
              <strong style={{ display: 'block', fontSize: '30px', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{settings?.years_of_excellence || '15+'}</strong>
              <small style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4, display: 'block', marginTop: '3px' }}>
                Years of<br />Excellence
              </small>
            </div>
          </div>

          {/* Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={heroContainerVariants}
          >
            <motion.p variants={heroItemVariants} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>
              About Our School
            </motion.p>
            <motion.h2 variants={heroItemVariants} style={{ fontFamily: "'Merriweather', serif", fontSize: 'clamp(1.7rem,2.8vw,2.3rem)', fontWeight: 700, color: '#0a143c', lineHeight: 1.3, marginBottom: '20px' }}>
              A Place Where Knowledge Meets Character
            </motion.h2>
            <motion.p variants={heroItemVariants} style={{ color: '#4b5563', lineHeight: 1.82, marginBottom: '14px', fontSize: '15px' }}>
              Shri Mangalchand Didwaniya Vidya Mandir has been a cornerstone of quality
              education in Raghunathgarh, Sikar since 2009. Our CBSE-affiliated curriculum
              blends academic rigour with holistic development.
            </motion.p>
            <motion.p variants={heroItemVariants} style={{ color: '#4b5563', lineHeight: 1.82, marginBottom: '20px', fontSize: '15px' }}>
              We believe every child carries a unique spark. Our experienced faculty,
              digital learning tools and nurturing environment help students discover
              and develop their full potential.
            </motion.p>
            {/* Motto box */}
            <motion.div variants={heroItemVariants} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 18px', background: '#fff8ed', borderLeft: '4px solid #f59e0b', borderRadius: '0 10px 10px 0', margin: '22px 0' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>🪔</span>
              <span style={{ fontFamily: "'Merriweather', serif", fontSize: '14.5px', fontStyle: 'italic', color: '#0a143c', fontWeight: 700 }}>
                "तमसो मा ज्योतिर्गमय" - Lead us from darkness to light
              </span>
            </motion.div>
            <motion.div variants={heroItemVariants}>
              <Link to="/about" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#f59e0b', color: '#0a143c', fontWeight: 700,
                fontSize: '14px', padding: '13px 28px', borderRadius: '10px',
                textDecoration: 'none', transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fbbf24'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Learn More About Us <ArrowRight size={17} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="responsive-section" style={{ background: '#f7f9ff' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={heroContainerVariants}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <motion.p variants={heroItemVariants} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>
              Why Choose SMD
            </motion.p>
            <motion.h2 variants={heroItemVariants} style={{ fontFamily: "'Merriweather', serif", fontSize: 'clamp(1.7rem,2.8vw,2.3rem)', fontWeight: 700, color: '#0a143c', marginBottom: '14px' }}>
              Everything a Student Needs to Thrive
            </motion.h2>
            <motion.p variants={heroItemVariants} style={{ color: '#6b7280', fontSize: '15.5px', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto' }}>
              From digital learning tools to sports grounds - an environment where learning is joyful and growth is holistic.
            </motion.p>
          </motion.div>

          {/* Cards */}
          <div className="responsive-grid-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="feature-card"
                style={{ background: '#fff', borderRadius: '16px', padding: '28px 22px', border: '1px solid #e5e7eb', textAlign: 'center', transition: 'box-shadow 0.25s, border-color 0.25s, transform 0.25s ease-out', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 50px rgba(10,20,60,0.15)'; e.currentTarget.style.borderColor = '#c7d9ff'; e.currentTarget.style.transform = 'translateY(-6px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ width: '58px', height: '58px', borderRadius: '15px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={26} color="#1d4ed8" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0a143c', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTICES + QUICK LINKS ────────────────────────── */}
      <section className="responsive-section">
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={heroContainerVariants}
            style={{ textAlign: 'center', marginBottom: '44px' }}
          >
            <motion.p variants={heroItemVariants} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>
              Latest Updates
            </motion.p>
            <motion.h2 variants={heroItemVariants} style={{ fontFamily: "'Merriweather', serif", fontSize: 'clamp(1.7rem,2.8vw,2.3rem)', fontWeight: 700, color: '#0a143c' }}>
              Notices & Announcements
            </motion.h2>
          </motion.div>

          <div className="responsive-grid-2" style={{ gap: '28px' }}>
            {loadingNotices ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <LoadingSpinner text="Loading Notices..." />
              </div>
            ) : notices.length === 0 ? (
              <p style={{ color: '#6b7280', padding: '15px 0', gridColumn: '1 / -1', textAlign: 'center' }}>No recent notices.</p>
            ) : (
              <>
                {/* Left Column (First 3 Notices) */}
                <div>
                  {notices.slice(0, 3).map((notice, index) => {
                    const date = new Date(notice.created_at)
                    const day = date.getDate().toString().padStart(2, '0')
                    const month = date.toLocaleString('default', { month: 'short' })
                    
                    return (
                      <div 
                        key={notice.id} 
                        onClick={() => setSelectedNotice(notice)}
                        style={{ padding: '12px 0', borderBottom: index === notices.slice(0, 3).length - 1 ? 'none' : '1px solid #e8ecf5', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '0 8px' }}>
                          <div style={{ flexShrink: 0, width: '45px', background: '#0a143c', color: '#fff', borderRadius: '8px', padding: '6px 4px', textAlign: 'center', fontSize: '10px', fontWeight: 700, lineHeight: 1.2 }}>
                            <strong style={{ display: 'block', fontSize: '16px', lineHeight: 1 }}>{day}</strong>
                            {month}
                          </div>
                          <div style={{ flex: 1, paddingTop: '1px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <p style={{ fontSize: '10px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>📢 Announcement</p>
                              <ChevronRight size={14} style={{ color: '#9ca3af' }} />
                            </div>
                            <p style={{ fontWeight: 600, fontSize: '13px', color: '#111827', lineHeight: 1.35 }}>{notice.title}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Right Column (Next 3 Notices) */}
                <div>
                  {notices.slice(3, 6).map((notice, index) => {
                    const date = new Date(notice.created_at)
                    const day = date.getDate().toString().padStart(2, '0')
                    const month = date.toLocaleString('default', { month: 'short' })
                    
                    return (
                      <div 
                        key={notice.id} 
                        onClick={() => setSelectedNotice(notice)}
                        style={{ padding: '12px 0', borderBottom: index === notices.slice(3, 6).length - 1 ? 'none' : '1px solid #e8ecf5', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '0 8px' }}>
                          <div style={{ flexShrink: 0, width: '45px', background: '#0a143c', color: '#fff', borderRadius: '8px', padding: '6px 4px', textAlign: 'center', fontSize: '10px', fontWeight: 700, lineHeight: 1.2 }}>
                            <strong style={{ display: 'block', fontSize: '16px', lineHeight: 1 }}>{day}</strong>
                            {month}
                          </div>
                          <div style={{ flex: 1, paddingTop: '1px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <p style={{ fontSize: '10px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>📢 Announcement</p>
                              <ChevronRight size={14} style={{ color: '#9ca3af' }} />
                            </div>
                            <p style={{ fontWeight: 600, fontSize: '13px', color: '#111827', lineHeight: 1.35 }}>{notice.title}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="responsive-section" style={{ background: 'linear-gradient(130deg, #0a143c 0%, #1a3aad 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 'clamp(1.8rem,3vw,2.2rem)', color: '#fff', marginBottom: '14px', fontWeight: 700 }}>
            Admissions Open for {settings?.admission_year || '2025–26'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '34px', lineHeight: 1.7 }}>
            Join our community of {settings?.student_count || '500+'} students. Apply online or visit our campus in Raghunathgarh, Sikar.
          </p>
          <Link to="/admissions" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#f59e0b', color: '#0a143c', fontWeight: 700,
            fontSize: '14px', padding: '14px 32px', borderRadius: '10px',
            textDecoration: 'none', transition: 'all 0.2s',
            boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fbbf24'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Start Your Application <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <AnimatePresence>
        {selectedNotice && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNotice(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden z-10 flex flex-col max-h-[85vh]">
              <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-slate-50">
                <div className="pr-4">
                  <span className="inline-block px-3 py-1 bg-smd-gold/20 text-smd-gold text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                    📢 Announcement
                  </span>
                  <h3 className="text-xl font-bold text-smd-navy leading-snug">{selectedNotice.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(selectedNotice.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => setSelectedNotice(null)} className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedNotice.content}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                <button onClick={() => setSelectedNotice(null)} className="px-6 py-2 bg-smd-navy text-white text-sm font-medium rounded-lg hover:bg-[#1a3aad] transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}