import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Phone, ArrowRight, BookOpen, Monitor, Trophy, Zap } from 'lucide-react'

import buildingImg from '@/assets/images/building.jpg'
import logoImg     from '@/assets/images/logo.png'

// ── Data ─────────────────────────────────────────────────

const STATS = [
  { value: '500+',    label: 'Students'        },
  { value: '15+',     label: 'Years of Trust'  },
  { value: '30+',     label: 'Expert Teachers' },
  { value: 'I – XII', label: 'All Classes'     },
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

// ── Component ─────────────────────────────────────────────

export default function Home() {
  const heroBgRef = useRef(null)

  // Parallax on scroll
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
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${buildingImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            willChange: 'transform',
          }}
        />

        {/* Gradient overlay — matches HTML exactly */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(110deg, rgba(5,10,40,0.90) 0%, rgba(5,10,40,0.75) 45%, rgba(5,10,40,0.35) 100%)',
          }}
        />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, padding: '0 4rem', maxWidth: '700px' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1px solid rgba(245,158,11,0.5)', background: 'rgba(245,158,11,0.12)',
            color: '#fcd34d', fontSize: '11.5px', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: '100px', marginBottom: '22px',
          }}>
            <span style={{ width: '6px', height: '6px', background: '#f59e0b', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
            CBSE Affiliated · Est. 2009 · Sikar
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Merriweather', serif",
            fontSize: 'clamp(2.1rem, 3.8vw, 3.4rem)',
            fontWeight: 900, color: '#fff', lineHeight: 1.18, marginBottom: '10px',
          }}>
            Shree Mangal Chand
            <span style={{ color: '#f59e0b', display: 'block' }}>Didwania Vidya Mandir</span>
          </h1>

          {/* Motto */}
          <p style={{
            fontFamily: "'Merriweather', serif",
            fontSize: '13.5px', fontStyle: 'italic',
            color: 'rgba(245,158,11,0.85)', marginBottom: '18px', letterSpacing: '0.03em',
          }}>
            "तमसो मा ज्योतिर्गमय" — Lead us from darkness to light
          </p>

          {/* Subtitle */}
          <p style={{
            fontSize: '15.5px', color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.75, maxWidth: '500px', marginBottom: '36px',
          }}>
            Nurturing young minds through quality CBSE education, modern infrastructure,
            and values-based learning at Raghunathgarh, Sikar, Rajasthan.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
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
          </div>
        </div>

        {/* ── STATS BAR — fully solid gold, no backdrop-filter ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        }}>
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              style={{
                padding: '18px 24px', textAlign: 'center',
                background: '#f59e0b',   /* ← solid gold, no opacity, no backdrop-filter */
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.25)' : 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fbbf24'}
              onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
            >
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0a143c', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{
                fontSize: '11px', fontWeight: 600,
                color: 'rgba(10,20,60,0.65)', marginTop: '3px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section style={{ padding: '80px 4rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

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
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>
              About Our School
            </p>
            <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 'clamp(1.7rem,2.8vw,2.3rem)', fontWeight: 700, color: '#0a143c', lineHeight: 1.3, marginBottom: '20px' }}>
              A Place Where Knowledge Meets Character
            </h2>
            <p style={{ color: '#4b5563', lineHeight: 1.82, marginBottom: '14px', fontSize: '15px' }}>
              Shree Mangal Chand Didwania Vidya Mandir has been a cornerstone of quality
              education in Raghunathgarh, Sikar since 2009. Our CBSE-affiliated curriculum
              blends academic rigour with holistic development.
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.82, marginBottom: '20px', fontSize: '15px' }}>
              We believe every child carries a unique spark. Our experienced faculty,
              digital learning tools, and nurturing environment help students discover
              and develop their full potential.
            </p>
            {/* Motto box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 18px', background: '#fff8ed', borderLeft: '4px solid #f59e0b', borderRadius: '0 10px 10px 0', margin: '22px 0' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>🪔</span>
              <span style={{ fontFamily: "'Merriweather', serif", fontSize: '14.5px', fontStyle: 'italic', color: '#0a143c', fontWeight: 700 }}>
                "तमसो मा ज्योतिर्गमय" — Lead us from darkness to light
              </span>
            </div>
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
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section style={{ padding: '80px 4rem', background: '#f7f9ff' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>
              Why Choose SMD
            </p>
            <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 'clamp(1.7rem,2.8vw,2.3rem)', fontWeight: 700, color: '#0a143c', marginBottom: '14px' }}>
              Everything a Student Needs to Thrive
            </h2>
            <p style={{ color: '#6b7280', fontSize: '15.5px', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto' }}>
              From digital learning tools to sports grounds — an environment where learning is joyful and growth is holistic.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                style={{ background: '#fff', borderRadius: '16px', padding: '28px 22px', border: '1px solid #e5e7eb', textAlign: 'center', transition: 'all 0.25s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(10,20,60,0.10)'; e.currentTarget.style.borderColor = '#c7d9ff' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb' }}
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
      <section style={{ padding: '80px 4rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>
              Latest Updates
            </p>
            <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: 'clamp(1.7rem,2.8vw,2.3rem)', fontWeight: 700, color: '#0a143c' }}>
              Notices & Announcements
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '28px' }}>
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
      <section style={{ background: 'linear-gradient(130deg, #0a143c 0%, #1a3aad 100%)', padding: '72px 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
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