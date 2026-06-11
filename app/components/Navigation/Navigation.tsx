'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Solutions', 'Why Us', 'Process', 'Testimonials', 'Pricing'];

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] z-[100] origin-left"
        style={{
          width: progressWidth,
          background: 'linear-gradient(90deg, #f5a623, #ff6b2b)',
        }}
      />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
        style={{ paddingTop: '2px' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full gradient-bg opacity-80 animate-pulse-glow" />
              <div className="absolute inset-[3px] rounded-full bg-black flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <circle cx="12" cy="12" r="4" fill="#f5a623" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <line
                      key={i}
                      x1="12" y1="12"
                      x2={12 + 8 * Math.cos((angle * Math.PI) / 180)}
                      y2={12 + 8 * Math.sin((angle * Math.PI) / 180)}
                      stroke="#f5a623"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Solaris</span>
              <span className="text-white/80 font-light"> Energy</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200 relative group"
                whileHover={{ y: -1 }}
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-px gradient-bg group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-full text-sm font-medium gradient-bg text-black solar-glow-sm transition-all duration-200"
            >
              Get Free Quote
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 space-y-1.5">
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: menuOpen ? 'auto' : 0, opacity: menuOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden glass border-t border-white/5"
        >
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="block text-white/60 hover:text-white py-2 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <button className="w-full mt-2 px-5 py-3 rounded-full text-sm font-medium gradient-bg text-black">
              Get Free Quote
            </button>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}
