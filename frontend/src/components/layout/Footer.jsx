import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Youtube, Facebook, ArrowRight } from 'lucide-react'
import logo from '../../assets/images/logo.webp'

export default function Footer() {
  return (
    <footer className="bg-[#0a143c] text-slate-300 pt-12 pb-8 border-t border-white/5">
      <div className="container-max section-padding !pt-0 !pb-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16 pt-12">
          
          {/* Brand Column */}
          <div className="md:col-span-12 lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SMD Logo" className="w-12 h-12 object-contain" />
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">SMD Vidya Mandir</h3>
                <p className="text-smd-gold text-xs font-bold tracking-widest uppercase mt-0.5">CBSE Affiliated</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering students through holistic education, cutting-edge facilities and a deep respect for core values since our foundation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.youtube.com/@SMDsikar" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-smd-blue hover:text-white transition-colors" aria-label="YouTube Channel">
                <Youtube size={20} />
              </a>
              <a href="https://www.facebook.com/SMDVidyaMandirCBSE/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:bg-smd-blue hover:text-white transition-colors" aria-label="Facebook Page">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-6 lg:col-span-3">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Our School', to: '/about' },
                { label: 'Academic Programs', to: '/academics' },
                { label: 'Admissions Open', to: '/admissions' },
                { label: 'Careers & Vacancies', to: '/careers' },
                { label: 'Campus Gallery', to: '/gallery' },
                { label: 'Contact Us', to: '/contact' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="group flex items-center text-slate-400 hover:text-smd-gold transition-colors text-sm font-medium">
                    <span className="w-0 overflow-hidden opacity-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-300 ease-out text-smd-gold">
                      <ArrowRight size={14} />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-6 lg:col-span-4">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Get in Touch</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-900/30 flex flex-shrink-0 items-center justify-center text-smd-gold border border-blue-800/30">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold mb-1">Campus Address</p>
                  <p className="text-slate-400 text-sm leading-relaxed">Khori Brahmanan, Raghunathgarh,<br/>Sikar, Rajasthan 332027</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-900/30 flex flex-shrink-0 items-center justify-center text-smd-gold border border-blue-800/30">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold mb-1">Phone Number</p>
                  <a href="tel:+919001995272" className="text-slate-400 hover:text-smd-gold transition-colors text-sm block">+91 9001995272</a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-900/30 flex flex-shrink-0 items-center justify-center text-smd-gold border border-blue-800/30">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold mb-1">Email Address</p>
                  <a href="mailto:smdvidyamandir@gmail.com" className="text-slate-400 hover:text-smd-gold transition-colors text-sm block">smdvidyamandir@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 pb-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm text-center md:text-left">
            © 2026 SMD Vidya Mandir. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Designed & Built by <a href="https://mail.google.com/mail/?view=cm&fs=1&to=jatin182006kumar@gmail.com" target="_blank" rel="noreferrer" className="text-slate-400 font-semibold hover:text-white transition-colors">Jatin Kumar</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
