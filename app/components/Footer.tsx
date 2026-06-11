'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5" style={{ background: '#030508' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <circle cx="12" cy="12" r="4" fill="black" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <line key={i} x1="12" y1="12"
                      x2={12 + 7 * Math.cos((angle * Math.PI) / 180)}
                      y2={12 + 7 * Math.sin((angle * Math.PI) / 180)}
                      stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                  ))}
                </svg>
              </div>
              <span className="font-bold"><span className="gradient-text">Solaris</span> <span className="text-white/60 font-light">Energy</span></span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed mb-4">
              Pioneering clean energy solutions for a sustainable tomorrow.
            </p>
            <div className="flex gap-3">
              {['twitter', 'linkedin', 'instagram'].map((social) => (
                <div key={social} className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:glass-warm cursor-pointer transition-all">
                  <div className="w-3 h-3 bg-white/30 rounded-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Solutions', links: ['Residential Solar', 'Commercial Solar', 'Industrial Solutions', 'Battery Storage', 'EV Charging'] },
            { title: 'Company', links: ['About Us', 'Our Team', 'Careers', 'Press', 'Contact'] },
            { title: 'Resources', links: ['Solar Calculator', 'Case Studies', 'Blog', 'Documentation', 'FAQs'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">© 2025 Solaris Energy. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
