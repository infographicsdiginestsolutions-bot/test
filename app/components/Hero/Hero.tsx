'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import dynamic from 'next/dynamic';

const SolarScene = dynamic(() => import('./SolarScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-t-[#f5a623] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full border-2 border-b-[#ff6b2b] border-t-transparent border-r-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
    </div>
  ),
});

const trustIndicators = [
  { value: '25+', label: 'Years Experience', icon: '🏆' },
  { value: '10,000+', label: 'Installations', icon: '⚡' },
  { value: '98%', label: 'Customer Satisfaction', icon: '⭐' },
];

/* Word-by-word animated headline */
function AnimatedHeadline() {
  const lines = [
    { words: ['Powering', 'Tomorrow'], gold: false },
    { words: ['with', 'Clean', 'Solar'], gold: true },
    { words: ['Energy'], gold: false },
  ];

  return (
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6">
      {lines.map((line, li) => (
        <div key={li} className="overflow-hidden">
          <motion.div
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5 + li * 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap justify-center gap-x-4"
          >
            {line.words.map((word, wi) => (
              <span key={wi} className={line.gold ? 'gradient-text' : 'text-white'}>
                {word}
              </span>
            ))}
          </motion.div>
        </div>
      ))}
    </h1>
  );
}

export default function Hero() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  /* Framer scroll */
  const { scrollYProgress } = useScroll({ target: heroRef });
  const rawScrollY = useMotionValue(0);
  const smoothScroll = useSpring(rawScrollY, { stiffness: 80, damping: 20 });

  /* Content parallax layers */
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.7]);
  const scaleScene = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  /* Mouse smoothing */
  const springX = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const springY = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = -(e.clientY / window.innerHeight - 0.5) * 2;
      springX.set(nx);
      springY.set(ny);
      setMouseX(nx);
      setMouseY(ny);
    };

    const onScroll = () => {
      const progress = window.scrollY / (window.innerHeight * 0.9);
      const clamped = Math.min(Math.max(progress, 0), 1);
      rawScrollY.set(clamped);
      setScrollY(clamped);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [springX, springY, rawScrollY]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[120vh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #0d1535 0%, #050810 60%)' }}
    >
      {/* ── 3D Scene (scales slightly on scroll) ────────────────── */}
      <motion.div className="absolute inset-0 z-0" style={{ scale: scaleScene }}>
        <SolarScene mouseX={mouseX} mouseY={mouseY} scrollY={scrollY} />
      </motion.div>

      {/* ── Gradient vignettes ──────────────────────────────────── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#050810] via-[#050810]/20 to-transparent" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#050810]/70 via-transparent to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-1/4 z-[1] bg-gradient-to-r from-[#050810]/60 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-1/4 z-[1] bg-gradient-to-l from-[#050810]/60 to-transparent" />

      {/* ── Scroll-driven darkening overlay ─────────────────────── */}
      <motion.div className="absolute inset-0 z-[2] bg-[#050810]" style={{ opacity: overlayOpacity }} />

      {/* ── Sunburst rays ───────────────────────────────────────── */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-[1] pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 left-0 origin-bottom"
            style={{
              width: '1.5px',
              height: '280px',
              background: `linear-gradient(to top, rgba(245,166,35,${0.25 - i * 0.005}), transparent)`,
              rotate: `${i * 20}deg`,
              translateX: '-50%',
            }}
            animate={{ scaleY: [0.7, 1.3, 0.7], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 5 + i * 0.3, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Floating CSS particles ───────────────────────────────── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {particleData.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              left: p.left,
              top: p.top,
              filter: 'blur(0.5px)',
            }}
            animate={{
              y: [-10, -80 - Math.random() * 60],
              x: [0, (Math.random() - 0.5) * 60],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* ── Parallax mouse-tracking highlight ring ───────────────── */}
      <motion.div
        className="absolute z-[1] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(245,166,35,0.06), transparent 70%)',
          x: useTransform(springX, [-1, 1], [-60, 60]),
          y: useTransform(springY, [-1, 1], [-60, 60]),
          top: '20%',
          left: '50%',
          translateX: '-50%',
        }}
      />

      {/* ── Hero Content ────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 glass-warm rounded-full px-5 py-2.5 mb-10"
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#f5a623]"
          />
          <span className="text-xs font-semibold text-[#f5a623] tracking-[0.2em] uppercase">
            Next-Gen Clean Energy
          </span>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="w-2 h-2 rounded-full bg-[#f5a623]"
          />
        </motion.div>

        {/* Animated headline */}
        <AnimatedHeadline />

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: 'easeOut' }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-14 leading-relaxed"
        >
          Reduce energy costs, achieve energy independence, and build a sustainable
          future with intelligent solar solutions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: '0 0 60px rgba(245,166,35,0.5), 0 0 120px rgba(245,166,35,0.2)',
            }}
            whileTap={{ scale: 0.97 }}
            className="relative px-9 py-4.5 rounded-full font-bold text-black gradient-bg text-base min-w-[240px] overflow-hidden group"
          >
            <span className="relative z-10">Get a Free Solar Consultation</span>
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ x: '-100%', skewX: -20 }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, borderColor: 'rgba(245,166,35,0.4)' }}
            whileTap={{ scale: 0.97 }}
            className="px-9 py-4.5 rounded-full font-medium text-white glass border border-white/10 text-base min-w-[200px] transition-colors duration-300"
          >
            Explore Our Solutions ↓
          </motion.button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.35 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {trustIndicators.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.45 + i * 0.12, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -4, scale: 1.05 }}
              className="glass-warm rounded-2xl px-6 py-4 text-center border border-[#f5a623]/10 cursor-default"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-2xl font-bold gradient-text">{item.value}</div>
              <div className="text-xs text-white/40 tracking-wide mt-0.5">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <motion.span
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-[10px] text-white/30 tracking-[0.3em] uppercase"
        >
          Scroll to explore
        </motion.span>

        {/* Animated scroll track */}
        <div className="relative w-5 h-10 rounded-full border border-white/15 flex justify-center overflow-hidden">
          <motion.div
            animate={{ y: [2, 22, 2], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-1.5 h-3 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #f5a623, #ff6b2b)', top: 4 }}
          />
        </div>

        {/* Chevrons */}
        <div className="flex flex-col items-center gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.1, 0.6, 0.1], y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-3 h-3 border-r border-b border-white/30 rotate-45"
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* Pre-computed particle data (avoids Math.random in render) */
const particleData = Array.from({ length: 28 }, (_, i) => ({
  size: `${2 + (i % 4)}px`,
  color: i % 4 === 0 ? '#f5a623' : i % 4 === 1 ? '#ff8c00' : i % 4 === 2 ? '#80c8ff' : '#ffffff',
  left: `${(i / 28) * 100}%`,
  top: `${45 + ((i * 17) % 45)}%`,
  duration: 3.5 + (i % 5),
  delay: (i * 0.4) % 6,
}));
