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
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }
}

const FACILITIES = [
  {
    icon: '📚', title: 'Library',
    desc: 'A well-stocked library with hundreds of books, encyclopaedias, newspapers, and magazines. Students are encouraged to develop a reading habit from an early age.',
    tags: ['Books & Reference', 'Newspapers', 'Reading Space'],
  },
  {
    icon: '🔬', title: 'Science Laboratories',
    desc: 'Separate Physics, Chemistry and Biology labs equipped with all necessary instruments and materials for practical experiments as per the CBSE syllabus.',
    tags: ['Physics Lab', 'Chemistry Lab', 'Biology Lab'],
  },
  {
    icon: '📽️', title: 'Digital Classrooms',
    desc: 'Classrooms equipped with projectors and digital boards to make teaching more visual, interactive and engaging for students across all classes.',
    tags: ['Projectors', 'Digital Boards', 'Interactive Learning'],
  },
  {
    icon: '⚽', title: 'Sports Facilities',
    desc: 'A spacious playground with facilities for cricket, football, volleyball, kabaddi and athletics. Annual sports day celebrations promote teamwork and fitness.',
    tags: ['Cricket', 'Football', 'Athletics', 'Kabaddi'],
  },
  {
    icon: '🚌', title: 'Transportation',
    desc: 'Safe and reliable school bus service covering Raghunathgarh, Sikar and nearby villages. All vehicles are GPS-tracked and supervised by trained staff.',
    tags: ['GPS Tracked', 'Multiple Routes', 'Safe Travel'],
  },
  {
    icon: '🏥', title: 'Medical Room',
    desc: 'A dedicated first-aid room with basic medical supplies and trained staff to handle minor injuries and health emergencies during school hours.',
    tags: ['First Aid', 'Trained Staff', 'Emergency Ready'],
  },
]

// ── Component ─────────────────────────────────────────────

/**
 * Facilities Page Component.
 * Showcases the campus infrastructure, labs, and sports amenities.
 */
export default function Facilities() {
  return (
    <>
      <Helmet>
        <title>Facilities – SMD Vidya Mandir</title>
        <meta name="description" content="Explore the facilities at SMD School - library, labs, digital classrooms, sports, and transportation." />
      </Helmet>

      {/* Header */}
      <div className="responsive-header" style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)' }}>
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <motion.p variants={itemVariants} style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Infrastructure</motion.p>
          <motion.h1 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Our Facilities</motion.h1>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.75 }}>
            Modern infrastructure designed to support academic, physical and personal growth of every student.
          </motion.p>
        </motion.div>
      </div>

      {/* Main Facilities */}
      <section className="responsive-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="responsive-grid-3">
            {FACILITIES.map(({ icon, title, desc, tags }) => (
              <motion.div variants={itemVariants} key={title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '18px', overflow: 'hidden', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(10,20,60,0.1)'; e.currentTarget.style.borderColor = '#c7d9ff' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb' }}
              >
                {/* Card Top */}
                <div style={{ background: '#f7f9ff', padding: '28px 24px 20px', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ width: '60px', height: '60px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '14px' }}>{icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: '17px', color: '#0a143c' }}>{title}</h3>
                </div>
                {/* Card Body */}
                <div style={{ padding: '20px 24px' }}>
                  <p style={{ fontSize: '13.5px', color: '#6b7280', lineHeight: 1.72, marginBottom: '16px' }}>{desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {tags.map(tag => (
                      <span key={tag} style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <section style={{ background: '#0a143c', padding: '48px 0' }} className="px-4 md:px-16">
        <div className="responsive-grid-4" style={{ maxWidth: '1160px', margin: '0 auto', textAlign: 'center' }}>
          {[
            { value: '500+', label: 'Students Enrolled' },
            { value: '6',    label: 'Major Facilities'  },
            { value: '3',    label: 'Science Labs'       },
            { value: '15+',  label: 'Bus Routes'         },
          ].map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginTop: '6px', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="responsive-section" style={{ textAlign: 'center', background: '#f7f9ff' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: '2rem', color: '#0a143c', marginBottom: '14px', fontWeight: 700 }}>Visit Our Campus</h2>
          <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '32px' }}>Come see our facilities in person. We'd love to show you around.</p>
          <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0a143c', color: '#fff', fontWeight: 700, fontSize: '14px', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', marginRight: '12px' }}>
            Get Directions <ArrowRight size={17} />
          </Link>
          <Link to="/admissions" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f59e0b', color: '#0a143c', fontWeight: 700, fontSize: '14px', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none' }}>
            Apply Now <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  )
}
