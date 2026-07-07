import { Helmet } from 'react-helmet-async'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import buildingImg from '@/assets/images/building.webp'
import logoImg from '@/assets/images/logo.webp'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }
}

const TEAM = [
  { name: 'Shri Mangalchand Didwaniya', role: 'Founder & Chairman', initial: 'M' },
  { name: 'Principal',                   role: 'Academic Head',      initial: 'P' },
  { name: 'Vice Principal',              role: 'Administration',     initial: 'V' },
]

const VALUES = [
  { icon: '🎯', title: 'Excellence',   desc: 'We pursue the highest standards in academics and character development.' },
  { icon: '🤝', title: 'Integrity',    desc: 'Honesty and ethics are the foundation of everything we do.' },
  { icon: '💡', title: 'Innovation',   desc: 'Encouraging curiosity, creativity and modern thinking in every student.' },
  { icon: '🌱', title: 'Growth',       desc: 'Every child grows at their own pace - we nurture each one individually.' },
]

// ── Component ─────────────────────────────────────────────

/**
 * About Page Component.
 * Displays the history, mission, vision, and leadership information of the school.
 */
export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us – SMD Vidya Mandir</title>
        <meta name="description" content="Learn about Shri Mangalchand Didwaniya Vidya Mandir - our history, vision, mission and leadership." />
      </Helmet>

      {/* Page Header */}
      <div className="responsive-header relative overflow-hidden" style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)' }}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <motion.div 
          initial="hidden" animate="visible" variants={containerVariants}
          style={{ maxWidth: '1160px', margin: '0 auto', position: 'relative', zIndex: 10 }}
        >
          <motion.p variants={itemVariants} style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Who We Are</motion.p>
          <motion.h1 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>About Our School</motion.h1>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.75 }}>
            A legacy of quality education, values and holistic development since 2009 in Raghunathgarh, Sikar.
          </motion.p>
        </motion.div>
      </div>

      {/* History + Image */}
      <section className="responsive-section">
        <div className="responsive-grid-2" style={{ maxWidth: '1160px', margin: '0 auto', alignItems: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ position: 'relative' }}>
            <motion.img variants={itemVariants} src={buildingImg} alt="SMD School" style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 64px rgba(10,20,60,0.15)', display: 'block' }} />
            <motion.div variants={itemVariants} style={{ position: 'absolute', bottom: '-18px', left: '-18px', background: '#f59e0b', borderRadius: '14px', padding: '18px 24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(245,158,11,0.35)' }}>
              <strong style={{ display: 'block', fontSize: '30px', fontWeight: 800, color: '#0a143c', lineHeight: 1 }}>2009</strong>
              <small style={{ fontSize: '11px', color: 'rgba(10,20,60,0.7)', display: 'block', marginTop: '3px' }}>Year Founded</small>
            </motion.div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants}>
            <motion.p variants={itemVariants} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>Our Story</motion.p>
            <motion.h2 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.6rem,2.5vw,2.1rem)', fontWeight: 700, color: '#0a143c', lineHeight: 1.35, marginBottom: '20px' }}>
              15+ Years of Shaping Young Minds
            </motion.h2>
            <motion.p variants={itemVariants} style={{ color: '#4b5563', lineHeight: 1.82, marginBottom: '14px', fontSize: '15px' }}>
              Shri Mangalchand Didwaniya Vidya Mandir was established in 2009 with a single vision - to provide world-class CBSE education to students in rural Rajasthan. What started as a small school has grown into a thriving institution serving 500+ students.
            </motion.p>
            <motion.p variants={itemVariants} style={{ color: '#4b5563', lineHeight: 1.82, marginBottom: '24px', fontSize: '15px' }}>
              Affiliated to CBSE and located in Khori Brahmanan, Raghunathgarh, we have consistently produced outstanding results while ensuring every child receives individual attention and holistic development.
            </motion.p>
            <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 18px', background: '#fff8ed', borderLeft: '4px solid #f59e0b', borderRadius: '0 10px 10px 0' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>🪔</span>
              <span style={{ fontFamily: "'Merriweather',serif", fontSize: '14px', fontStyle: 'italic', color: '#0a143c', fontWeight: 700 }}>
                "तमसो मा ज्योतिर्गमय" - Lead us from darkness to light
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="responsive-section" style={{ background: '#f7f9ff' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <motion.p variants={itemVariants} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>What Drives Us</motion.p>
            <motion.h2 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.7rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0a143c' }}>Vision & Mission</motion.h2>
          </div>
          <div className="responsive-grid-2">
            <motion.div variants={itemVariants} style={{ background: '#0a143c', borderRadius: '18px', padding: '36px', color: '#fff' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🔭</div>
              <h3 style={{ fontFamily: "'Merriweather',serif", fontSize: '1.3rem', fontWeight: 700, color: '#f59e0b', marginBottom: '14px' }}>Our Vision</h3>
              <p style={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, fontSize: '15px' }}>
                To be a premier educational institution that empowers every student with knowledge, values and skills to become responsible global citizens - while staying rooted in Indian culture and tradition.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '18px', padding: '36px' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontFamily: "'Merriweather',serif", fontSize: '1.3rem', fontWeight: 700, color: '#0a143c', marginBottom: '14px' }}>Our Mission</h3>
              <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '15px' }}>
                To provide a nurturing, inclusive and technology-enabled learning environment where students develop critical thinking, creativity and character - achieving academic excellence while growing as compassionate human beings.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="responsive-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <motion.p variants={itemVariants} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>What We Stand For</motion.p>
            <motion.h2 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.7rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0a143c' }}>Our Core Values</motion.h2>
          </div>
          <div className="responsive-grid-4">
            {VALUES.map(({ icon, title, desc }) => (
              <motion.div variants={itemVariants} key={title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px 22px', textAlign: 'center', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,20,60,0.1)'; e.currentTarget.style.borderColor = '#c7d9ff' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb' }}
              >
                <div style={{ fontSize: '36px', marginBottom: '14px' }}>{icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0a143c', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Leadership */}
      <section className="responsive-section" style={{ background: '#f7f9ff' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <motion.p variants={itemVariants} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>The Team</motion.p>
            <motion.h2 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.7rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0a143c' }}>Our Leadership</motion.h2>
          </div>
          <div className="responsive-grid-3">
            {TEAM.map(({ name, role, initial }) => (
              <motion.div variants={itemVariants} key={name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#0a143c', color: '#f59e0b', fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{initial}</div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0a143c', marginBottom: '6px' }}>{name}</h3>
                <p style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(130deg,#0a143c 0%,#1a3aad 100%)', padding: '72px 4rem', textAlign: 'center' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <motion.h2 variants={itemVariants} style={{ fontFamily: "'Merriweather',serif", fontSize: '2rem', color: '#fff', marginBottom: '14px', fontWeight: 700 }}>Join the SMD Family</motion.h2>
          <motion.p variants={itemVariants} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '32px' }}>Be part of a school that cares about every child's future.</motion.p>
          <motion.div variants={itemVariants}>
            <Link to="/admissions" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f59e0b', color: '#0a143c', fontWeight: 700, fontSize: '14px', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none' }}>
              Apply for Admission <ArrowRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
