import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Youtube, Facebook } from 'lucide-react'

/**
 * Footer Component.
 * Renders the bottom section of the public website containing contact info,
 * quick links, and social media icons.
 */
export default function Footer() {
  return (
    <footer className="bg-smd-blue text-white">
      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-smd-gold">SMD Digital Campus</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Shree Mangal Chand Didwania Vidya Mandir<br />
              CBSE Affiliated School<br />
              Khori Brahmanan, Raghunathgarh, Sikar, Rajasthan
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-smd-gold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {['About', 'Academics', 'Admissions', 'Gallery', 'MPD', 'Contact'].map(l => (
                <li key={l}><Link to={`/${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-smd-gold">Contact</h3>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-2"><Phone size={16} /><span>+91-9001995272</span></div>
              <div className="flex items-center gap-2"><Mail size={16} /><span>smdvidyamandir@gmail.com</span></div>
              <div className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /><span>Khori Brahmanan, Raghunathgarh, Sikar, Rajasthan</span></div>
              <div className="flex gap-4 mt-4">
                <a href="https://www.youtube.com/@SMDsikar"  target="_blank" rel="noreferrer" className="hover:text-smd-gold transition-colors"><Youtube size={20} /></a>
                <a href="https://www.facebook.com/SMDVidyaMandirCBSE/" target="_blank" rel="noreferrer" className="hover:text-smd-gold transition-colors"><Facebook size={20} /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm text-white/50">
          © {new Date().getFullYear()} SMD Digital Campus. Built by Jatin Kumar.
        </div>
      </div>
    </footer>
  )
}
