import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Phone, ArrowRight, BookOpen, Monitor, Trophy, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'

import buildingImg from '@/assets/images/building.jpg'
import logoImg     from '@/assets/images/logo.png'
import VanillaTilt from 'vanilla-tilt'

// ── Data ─────────────────────────────────────────────────

const STATS = [
  { end: 500, suffix: '+', label: 'Students'        },
  { end: 15,  suffix: '+', label: 'Years of Trust'  },
  { end: 30,  suffix: '+', label: 'Expert Teachers' },
  { value: 'I – XII',      label: 'All Classes'     },
]

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

const NOTICES = [
  { day: '25', month: 'Jun', tag: '📢 Announcement', title: 'Admissions Open for Session 2025–26 — All Classes'      },
  { day: '20', month: 'Jun', tag: '📅 Holiday',      title: 'Summer break revised — School resumes July 1'           },
  { day: '15', month: 'Jun', tag: '📝 Exam',         title: 'Pre-board timetable released for Class X & XII'         },
  { day: '10', month: 'Jun', tag: '🎉 Event',        title: 'Annual Sports Day — Highlights and results published'    },
]

const QUICK_LINKS = [
  { emoji: '📋', label: 'Admission Form',       to: '/admissions' },
  { emoji: '📄', label: 'Fee Structure',        to: '/contact'    },
  { emoji: '📅', label: 'Academic Calendar',    to: '/academics'  },
  { emoji: '🎓', label: 'Student Login',        to: '/login'      },
  { emoji: '👨‍👩‍👧', label: 'Parent Login',  to: '/login'      },
  { emoji: '📊', label: 'Mandatory Disclosure', to: '/mpd'        },
]

// ── Animation Variants ────────────────────────────────────

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.15 }
  }
}

const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.90, ease: [0.25, 0.1, 0.25, 1] } }
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
      <style>
        {`
          @keyframes goldPulse {
            0% { text-shadow: 0 0 5px rgba(245,158,11,0.2); }
            50% { text-shadow: 0 0 15px rgba(245,158,11,0.8), 0 0 25px rgba(245,158,11,0.4); }
            100% { text-shadow: 0 0 5px rgba(245,158,11,0.2); }
          }
          .glowing-number {
            animation: goldPulse 2.5s infinite ease-in-out;
          }
        `}
      </style>
      <Helmet>
        <title>SMD Digital Campus – Best CBSE School in Sikar, Rajasthan</title>
        <meta
          name="description"
          content="Shree Mangal Chand Didwania Vidya Mandir – CBSE affiliated school in Raghunathgarh, Sikar. Admissions open for 2025–26."
        />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        style={{ position: 'relative', height: '100vh', minHeight: '600px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
      >
        {/* Parallax background */}
        <div
          ref={heroBgRef}
          className="absolute inset-0 bg-cover bg-[80%_center] md:bg-[center_25%]"
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
          className="relative z-10 px-4 md:px-16 max-w-[700px]"
        >

          {/* Badge */}
          <motion.div variants={heroItemVariants} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.12)',
            color: '#fcd34d', fontSize: '11.5px', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: '100px', marginBottom: '22px',
          }}>
            <span style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
            CBSE Affiliated · Est. 2009 · Sikar
          </motion.div>

          {/* Title */}
          <motion.h1 variants={heroItemVariants} className="font-serif text-3xl md:text-5xl lg:text-[3.4rem] font-black text-white leading-[1.18] mb-3">
            Shree Mangal Chand
            <span className="text-amber-500 block">Didwania Vidya Mandir</span>
          </motion.h1>

          {/* Motto */}
          <motion.p variants={heroItemVariants} className="font-serif text-xs md:text-[13.5px] italic text-amber-500/85 mb-4 md:mb-5 tracking-[0.03em]">
            "तमसो मा ज्योतिर्गमय" — Lead us from darkness to light
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
              <div className="glowing-number text-lg md:text-[26px] font-extrabold text-amber-500 leading-none">
                {end ? (
                  <CountUp end={end} suffix={suffix} enableScrollSpy scrollSpyOnce duration={4.5} scrollSpyDelay={500} />
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
              style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 64px rgba(10,20,60,0.16)', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: '-18px', right: '-18px',
              background: '#0a143c', color: '#fff', borderRadius: '14px',
              padding: '18px 22px', textAlign: 'center',
              boxShadow: '0 8px 32px rgba(10,20,60,0.32)',
            }}>
              <strong style={{ display: 'block', fontSize: '30px', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>15+</strong>
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
              Shree Mangal Chand Didwania Vidya Mandir has been a cornerstone of quality
              education in Raghunathgarh, Sikar since 2009. Our CBSE-affiliated curriculum
              blends academic rigour with holistic development.
            </motion.p>
            <motion.p variants={heroItemVariants} style={{ color: '#4b5563', lineHeight: 1.82, marginBottom: '20px', fontSize: '15px' }}>
              We believe every child carries a unique spark. Our experienced faculty,
              digital learning tools, and nurturing environment help students discover
              and develop their full potential.
            </motion.p>
            {/* Motto box */}
            <motion.div variants={heroItemVariants} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 18px', background: '#fff8ed', borderLeft: '4px solid #f59e0b', borderRadius: '0 10px 10px 0', margin: '22px 0' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>🪔</span>
              <span style={{ fontFamily: "'Merriweather', serif", fontSize: '14.5px', fontStyle: 'italic', color: '#0a143c', fontWeight: 700 }}>
                "तमसो मा ज्योतिर्गमय" — Lead us from darkness to light
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
              From digital learning tools to sports grounds — an environment where learning is joyful and growth is holistic.
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
            {/* Notices */}
            <div>
              {NOTICES.map(({ day, month, tag, title }) => (
                <div key={title} style={{ display: 'flex', gap: '14px', padding: '15px 0', borderBottom: '1px solid #e8ecf5' }}>
                  <div style={{ flexShrink: 0, width: '50px', background: '#0a143c', color: '#fff', borderRadius: '9px', padding: '8px 6px', textAlign: 'center', fontSize: '11px', fontWeight: 700, lineHeight: 1.3 }}>
                    <strong style={{ display: 'block', fontSize: '19px', lineHeight: 1 }}>{day}</strong>
                    {month}
                  </div>
                  <div style={{ paddingTop: '2px' }}>
                    <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{tag}</p>
                    <p style={{ fontWeight: 600, fontSize: '13.5px', color: '#111827', lineHeight: 1.4 }}>{title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div style={{ background: '#0a143c', borderRadius: '16px', padding: '22px' }}>
              <h3 style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                Quick Links
              </h3>
              {QUICK_LINKS.map(({ emoji, label, to }) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    color: 'rgba(255,255,255,0.78)', textDecoration: 'none',
                    fontSize: '13.5px', padding: '10px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.78)'}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
                    <span>{label}</span>
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', flexShrink: 0 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="responsive-section" style={{ background: 'linear-gradient(130deg, #0a143c 0%, #1a3aad 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60%', right: '-5%', width: '520px', height: '520px', background: 'rgba(245,158,11,0.07)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 'clamp(1.8rem,3vw,2.2rem)', color: '#fff', marginBottom: '14px', fontWeight: 700 }}>
            Admissions Open for 2025–26
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '34px', lineHeight: 1.7 }}>
            Join our community of 500+ students. Apply online or visit our campus in Raghunathgarh, Sikar.
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
    </>
  )
}