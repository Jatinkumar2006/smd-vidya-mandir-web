import { Helmet } from 'react-helmet-async'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import buildingImg from '@/assets/images/building.jpg'
import logoImg from '@/assets/images/logo.png'

const TEAM = [
  { name: 'Shri Mangal Chand Didwania', role: 'Founder & Chairman', initial: 'M' },
  { name: 'Principal',                   role: 'Academic Head',      initial: 'P' },
  { name: 'Vice Principal',              role: 'Administration',     initial: 'V' },
]

const VALUES = [
  { icon: '🎯', title: 'Excellence',   desc: 'We pursue the highest standards in academics and character development.' },
  { icon: '🤝', title: 'Integrity',    desc: 'Honesty and ethics are the foundation of everything we do.' },
  { icon: '💡', title: 'Innovation',   desc: 'Encouraging curiosity, creativity and modern thinking in every student.' },
  { icon: '🌱', title: 'Growth',       desc: 'Every child grows at their own pace — we nurture each one individually.' },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us – SMD Digital Campus</title>
        <meta name="description" content="Learn about Shree Mangal Chand Didwania Vidya Mandir — our history, vision, mission and leadership." />
      </Helmet>

      {/* Page Header */}
      <div style={{ background: 'linear-gradient(110deg,#0a143c 0%,#1a3aad 100%)', padding: '100px 4rem 60px', marginTop: '70px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <p style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>Who We Are</p>
          <h1 style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>About Our School</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.75 }}>
            A legacy of quality education, values, and holistic development since 2009 in Raghunathgarh, Sikar.
          </p>
        </div>
      </div>

      {/* History + Image */}
      <section style={{ padding: '80px 4rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src={buildingImg} alt="SMD School" style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '18px', boxShadow: '0 24px 64px rgba(10,20,60,0.15)', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: '-18px', left: '-18px', background: '#f59e0b', borderRadius: '14px', padding: '18px 24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(245,158,11,0.35)' }}>
              <strong style={{ display: 'block', fontSize: '30px', fontWeight: 800, color: '#0a143c', lineHeight: 1 }}>2009</strong>
              <small style={{ fontSize: '11px', color: 'rgba(10,20,60,0.7)', display: 'block', marginTop: '3px' }}>Year Founded</small>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>Our Story</p>
            <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.6rem,2.5vw,2.1rem)', fontWeight: 700, color: '#0a143c', lineHeight: 1.35, marginBottom: '20px' }}>
              15+ Years of Shaping Young Minds
            </h2>
            <p style={{ color: '#4b5563', lineHeight: 1.82, marginBottom: '14px', fontSize: '15px' }}>
              Shree Mangal Chand Didwania Vidya Mandir was established in 2009 with a single vision — to provide world-class CBSE education to students in rural Rajasthan. What started as a small school has grown into a thriving institution serving 500+ students.
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.82, marginBottom: '24px', fontSize: '15px' }}>
              Affiliated to CBSE and located in Khori Brahmanan, Raghunathgarh, we have consistently produced outstanding results while ensuring every child receives individual attention and holistic development.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 18px', background: '#fff8ed', borderLeft: '4px solid #f59e0b', borderRadius: '0 10px 10px 0' }}>
              <span style={{ fontSize: '22px', flexShrink: 0 }}>🪔</span>
              <span style={{ fontFamily: "'Merriweather',serif", fontSize: '14px', fontStyle: 'italic', color: '#0a143c', fontWeight: 700 }}>
                "तमसो मा ज्योतिर्गमय" — Lead us from darkness to light
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section style={{ padding: '80px 4rem', background: '#f7f9ff' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>What Drives Us</p>
            <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.7rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0a143c' }}>Vision & Mission</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: '#0a143c', borderRadius: '18px', padding: '36px', color: '#fff' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🔭</div>
              <h3 style={{ fontFamily: "'Merriweather',serif", fontSize: '1.3rem', fontWeight: 700, color: '#f59e0b', marginBottom: '14px' }}>Our Vision</h3>
              <p style={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.8, fontSize: '15px' }}>
                To be a premier educational institution that empowers every student with knowledge, values, and skills to become responsible global citizens — while staying rooted in Indian culture and tradition.
              </p>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '18px', padding: '36px' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontFamily: "'Merriweather',serif", fontSize: '1.3rem', fontWeight: 700, color: '#0a143c', marginBottom: '14px' }}>Our Mission</h3>
              <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '15px' }}>
                To provide a nurturing, inclusive, and technology-enabled learning environment where students develop critical thinking, creativity, and character — achieving academic excellence while growing as compassionate human beings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ padding: '80px 4rem' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>What We Stand For</p>
            <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.7rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0a143c' }}>Our Core Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px 22px', textAlign: 'center', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(10,20,60,0.1)'; e.currentTarget.style.borderColor = '#c7d9ff' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb' }}
              >
                <div style={{ fontSize: '36px', marginBottom: '14px' }}>{icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0a143c', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section style={{ padding: '80px 4rem', background: '#f7f9ff' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '10px' }}>The Team</p>
            <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: 'clamp(1.7rem,2.8vw,2.2rem)', fontWeight: 700, color: '#0a143c' }}>Our Leadership</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {TEAM.map(({ name, role, initial }) => (
              <div key={name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#0a143c', color: '#f59e0b', fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{initial}</div>
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0a143c', marginBottom: '6px' }}>{name}</h3>
                <p style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(130deg,#0a143c 0%,#1a3aad 100%)', padding: '72px 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Merriweather',serif", fontSize: '2rem', color: '#fff', marginBottom: '14px', fontWeight: 700 }}>Join the SMD Family</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '32px' }}>Be part of a school that cares about every child's future.</p>
          <Link to="/admissions" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f59e0b', color: '#0a143c', fontWeight: 700, fontSize: '14px', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none' }}>
            Apply for Admission <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  )
}
