import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
}

const CLASSES = [
  { range: 'Class I – V',   label: 'Primary',    desc: 'Strong foundation in languages, mathematics, EVS and arts with activity-based learning.' },
  { range: 'Class VI – VIII', label: 'Middle',   desc: 'Deeper subject exploration with Science, Social Science, Hindi, English and Mathematics.' },
  { range: 'Class IX – X',  label: 'Secondary',  desc: 'CBSE board preparation with focused academics, practicals and career guidance.' },
  { range: 'Class XI – XII', label: 'Senior',    desc: 'Streams: Science & Commerce. Rigorous preparation for board exams and competitive tests.' },
]

const SUBJECTS = [
  { name: 'Mathematics',         icon: '📐' },
  { name: 'Science',             icon: '🔬' },
  { name: 'Social Science',      icon: '🌍' },
  { name: 'English',             icon: '📖' },
  { name: 'Hindi',               icon: '🖊️' },
  { name: 'Computer Science',    icon: '💻' },
  { name: 'Physical Education',  icon: '🏃' },
  { name: 'Art & Craft',         icon: '🎨' },
]

const HIGHLIGHTS = [
  { icon: '📊', title: 'Regular Assessments',    desc: 'Unit tests, half-yearly and annual exams following CBSE pattern.' },
  { icon: '📽️', title: 'Digital Teaching',       desc: 'Projectors and digital boards for visual and interactive learning.' },
  { icon: '📚', title: 'Library',                desc: 'Well-stocked library with books, newspapers and reference material.' },
  { icon: '🧪', title: 'Science Labs',           desc: 'Physics, Chemistry and Biology labs for hands-on experiments.' },
  { icon: '🏅', title: 'Co-curricular',          desc: 'Sports, debates, cultural events and competitions for all students.' },
  { icon: '🧑‍🏫', title: 'Personal Attention',   desc: 'Small class sizes ensuring every student gets individual guidance.' },
]

// ── Component ─────────────────────────────────────────────

/**
 * Academics Page Component.
 * Outlines the curriculum structure, subjects offered, and pedagogical approach.
 */
export default function Academics() {
  return (
    <>
      <Helmet>
        <title>Academics – SMD Digital Campus</title>
        <meta name="description" content="CBSE curriculum, classes I to XII, subjects, and academic structure at SMD School Sikar." />
      </Helmet>

      {/* Header */}
      <div className="responsive-header" style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)' }}>
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <motion.p variants={itemVariants} style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Education</motion.p>
          <motion.h1 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Academics</motion.h1>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.75 }}>
            CBSE-affiliated curriculum from Class I to XII, built to inspire curiosity and academic excellence.
          </motion.p>
        </motion.div>
      </div>

      {/* Curriculum Levels */}
      <section className="responsive-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <motion.p variants={itemVariants} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>Structure</motion.p>
            <motion.h2 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.7rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0a143c' }}>Classes Offered</motion.h2>
          </div>
          <div className="responsive-grid-4">
            {CLASSES.map(({ range, label, desc }, i) => (
              <motion.div variants={itemVariants} key={range} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,20,60,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ background: i % 2 === 0 ? '#0a143c' : '#f59e0b', padding: '20px 22px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: i % 2 === 0 ? '#f59e0b' : '#0a143c', marginBottom: '4px' }}>{label}</p>
                  <h3 style={{ fontWeight: 800, fontSize: '18px', color: i % 2 === 0 ? '#fff' : '#0a143c' }}>{range}</h3>
                </div>
                <div style={{ padding: '20px 22px', background: '#fff' }}>
                  <p style={{ fontSize: '13.5px', color: '#6b7280', lineHeight: 1.7 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Subjects */}
      <section className="responsive-section" style={{ background: '#f7f9ff' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>Curriculum</p>
            <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.7rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0a143c' }}>Subjects We Teach</h2>
          </div>
          <div className="responsive-grid-4" style={{ gap: '14px' }}>
            {SUBJECTS.map(({ name, icon }) => (
              <div key={name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fff8ed' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff' }}
              >
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#0a143c' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Highlights */}
      <section className="responsive-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <motion.p variants={itemVariants} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>At SMD School</motion.p>
            <motion.h2 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.7rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0a143c' }}>Academic Highlights</motion.h2>
          </div>
          <div className="responsive-grid-3">
            {HIGHLIGHTS.map(({ icon, title, desc }) => (
              <motion.div variants={itemVariants} key={title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px 24px', display: 'flex', gap: '16px', alignItems: 'flex-start', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d9ff'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,20,60,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <span style={{ fontSize: '28px', flexShrink: 0, marginTop: '2px' }}>{icon}</span>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0a143c', marginBottom: '6px' }}>{title}</h3>
                  <p style={{ fontSize: '13.5px', color: '#6b7280', lineHeight: 1.65 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(130deg,#0a143c 0%,#1a3aad 100%)', padding: '72px 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: '2rem', color: '#fff', marginBottom: '14px', fontWeight: 700 }}>Ready to Enroll?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '32px' }}>Admissions are open for 2025–26. Apply today and secure your child's future.</p>
          <Link to="/admissions" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f59e0b', color: '#0a143c', fontWeight: 700, fontSize: '14px', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none' }}>
            Apply for Admission <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  )
}
