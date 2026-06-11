'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';

const SolarScene = dynamic(() => import('./SolarScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#f5a623 transparent transparent transparent' }} />
    </div>
  ),
});

const trustIndicators = [
  { value: '25+', label: 'Years Experience' },
  { value: '10,000+', label: 'Installations' },
  { value: '98%', label: 'Customer Satisfaction' },
];

export default function Hero() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 2);
      setMouseY(-(e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #0a0f1e 40%, #12183a 70%, #0a0f1e 100%)' }}
    >
      {/* 3D Solar Scene */}
      <div className="absolute inset-0 z-0">
        <SolarScene mouseX={mouseX} mouseY={mouseY} />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#050810] via-transparent to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050810]/60 via-transparent to-transparent" />

      {/* Animated sunburst rays */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1] opacity-20">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 origin-bottom"
            style={{
              width: '2px',
              height: '300px',
              background: 'linear-gradient(to top, #f5a623, transparent)',
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              animationDelay: `${i * 0.2}s`,
              animation: 'sunray-expand 4s ease-in-out infinite',
            }}
          />
        ))}
      </div>

      {/* Floating energy particles */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: i % 3 === 0 ? '#f5a623' : i % 3 === 1 ? '#ff8c00' : '#ffffff',
              left: `${Math.random() * 100}%`,
              top: `${40 + Math.random() * 60}%`,
              opacity: 0.6,
              '--duration': `${4 + Math.random() * 4}s`,
              '--delay': `${Math.random() * 4}s`,
            } as React.CSSProperties}
            className="absolute rounded-full particle"
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 glass-warm rounded-full px-4 py-2 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse" />
          <span className="text-xs font-medium text-[#f5a623] tracking-wider uppercase">
            Clean Energy Solutions
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          <span className="text-white">Powering Tomorrow</span>
          <br />
          <span className="gradient-text">with Clean Solar</span>
          <br />
          <span className="text-white">Energy</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Reduce energy costs, achieve energy independence, and build a sustainable
          future with intelligent solar solutions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(245,166,35,0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-full font-semibold text-black gradient-bg solar-glow text-base min-w-[220px] transition-all duration-300"
          >
            Get a Free Solar Consultation
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-full font-medium text-white glass border border-white/10 hover:border-white/20 text-base min-w-[200px] transition-all duration-300"
          >
            Explore Our Solutions
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {trustIndicators.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.15 }}
              className="text-center"
            >
              <div className="text-3xl font-bold gradient-text mb-1">{item.value}</div>
              <div className="text-xs text-white/40 tracking-wide uppercase">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/30 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
