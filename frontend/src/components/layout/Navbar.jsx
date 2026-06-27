import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import logoImg from '@/assets/images/logo.png'

const NAV_LINKS = [
  { to: '/',           label: 'Home'       },
  { to: '/about',      label: 'About'      },
  { to: '/academics',  label: 'Academics'  },
  { to: '/facilities', label: 'Facilities' },
  { to: '/gallery',    label: 'Gallery'    },
  { to: '/mpd',        label: 'MPD'        },
  { to: '/contact',    label: 'Contact'    },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Solid navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '70px',
        background: scrolled ? '#0a143c' : 'rgba(10,20,60,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
        transition: 'all 0.3s',
        display: 'flex', alignItems: 'center',
        padding: '0 2.5rem',
      }}
    >
      {/* ── Brand (Logo + Name) ── */}
      <Link
        to="/"
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          textDecoration: 'none', flexShrink: 0,
        }}
      >
        {/* Logo */}
        <img
          src={logoImg}
          alt="SMD School Logo"
          style={{
            width: '46px', height: '46px', objectFit: 'contain',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        />

        {/* School name + subtitle — matches screenshot exactly */}
        <div>
          <div style={{
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '15px',
            lineHeight: 1.25,
            letterSpacing: '0.01em',
          }}>
            SMD Digital Campus
          </div>
          <div style={{
            color: '#f59e0b',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            marginTop: '2px',
          }}>
            CBSE Affiliated · Sikar, Rajasthan
          </div>
        </div>
      </Link>

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Desktop Nav Links ── */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '2px',
        }}
        className="hidden-mobile"
      >
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.78)',
              textDecoration: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              padding: '7px 13px',
              borderRadius: '7px',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              transition: 'all 0.2s',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('0.12'))
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.classList.contains('active'))
                e.currentTarget.style.background = 'transparent'
            }}
          >
            {label}
          </NavLink>
        ))}

        {/* Apply Now CTA */}
        <Link
          to="/admissions"
          style={{
            marginLeft: '10px',
            background: '#f59e0b',
            color: '#0a143c',
            fontWeight: 700,
            fontSize: '13.5px',
            padding: '8px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'all 0.2s',
            boxShadow: '0 2px 12px rgba(245,158,11,0.35)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fbbf24'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          Apply Now
        </Link>
      </div>

      {/* ── Mobile Hamburger ── */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',   // shown via media query below
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '6px',
        }}
        className="show-mobile"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ── Mobile Dropdown Menu ── */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute', top: '70px', left: 0, right: 0,
            background: '#0a143c',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '12px 1.5rem 20px',
            display: 'flex', flexDirection: 'column', gap: '4px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                color: isActive ? '#f59e0b' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                padding: '10px 12px',
                borderRadius: '8px',
                background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
          <Link
            to="/admissions"
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: '8px',
              background: '#f59e0b', color: '#0a143c',
              fontWeight: 700, fontSize: '14px',
              padding: '11px 18px', borderRadius: '8px',
              textDecoration: 'none', textAlign: 'center',
            }}
          >
            Apply Now
          </Link>
        </div>
      )}

      {/* Inline responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: block !important; }
        }
      `}</style>
    </nav>
  )
}