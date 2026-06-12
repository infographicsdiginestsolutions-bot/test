'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Reveal, ParallaxLayer } from '../ScrollEffects';

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  const sunScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1.2, 1.5]);
  const sunOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.4]);
  const raysRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const smoothRays = useSpring(raysRotate, { stiffness: 40, damping: 15 });
  const textY = useTransform(scrollYProgress, [0, 1], ['30px', '-30px']);

  return (
    <section ref={sectionRef} className="relative py-40 overflow-hidden" style={{ background: '#050810' }}>
      {/* Scroll-driven sunburst */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ scale: sunScale, opacity: sunOpacity }}
      >
        <div className="relative w-[700px] h-[700px]">
          {/* Rotating rays */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ rotate: smoothRays }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 origin-left"
                style={{
                  width: '50%',
                  height: '1.5px',
                  background: `linear-gradient(to right, rgba(245,166,35,${0.18 - i * 0.005}), transparent)`,
                  rotate: `${i * 18}deg`,
                  translateX: '-0%',
                  translateY: '-50%',
                }}
                animate={{ scaleX: [0.7, 1.3, 0.7], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 3 + i * 0.2, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>

          {/* Pulsing orb */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full"
            style={{ background: 'radial-gradient(circle, #fff5cc, #f5a623 40%, #ff6b2b 70%, transparent 100%)' }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Outer rings */}
          {[150, 250, 340].map((r, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5a623]"
              style={{ width: r, height: r }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.18, 0.06] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Radial glow */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.07) 0%, transparent 65%)' }} />

      <motion.div style={{ y: textY }} className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <Reveal direction="scale">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass-warm rounded-full px-4 py-2 mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#f5a623]"
            />
            <span className="text-xs font-medium text-[#f5a623] tracking-wider uppercase">Start Today</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            <span className="text-white">Start Your</span>
            <br />
            <span className="gradient-text">Solar Journey</span>
            <br />
            <span className="text-white">Today</span>
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.2}>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-14 leading-relaxed">
            Join over 10,000 homes and businesses that have already made the switch
            to clean, reliable solar energy. Your free assessment takes just 30 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.07, boxShadow: '0 0 70px rgba(245,166,35,0.55)' }}
              whileTap={{ scale: 0.97 }}
              className="relative px-10 py-5 rounded-full font-bold text-black gradient-bg solar-glow text-base min-w-[280px] overflow-hidden group"
            >
              <span className="relative z-10">Schedule a Free Assessment</span>
              <motion.div
                className="absolute inset-0 bg-white/25 rounded-full"
                initial={{ x: '-100%', skewX: -15 }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.55 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, borderColor: 'rgba(245,166,35,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-5 rounded-full font-medium text-white glass border border-white/10 text-base min-w-[240px] transition-colors duration-300"
            >
              Speak with an Energy Expert
            </motion.button>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/30">
            {['✓ No obligation', '✓ Same-day response', '✓ Expert consultation', '✓ 0% financing available'].map((item) => (
              <motion.span
                key={item}
                whileHover={{ color: 'rgba(245,166,35,0.7)', y: -2 }}
                className="text-white/40 cursor-default transition-colors"
              >
                {item}
              </motion.span>
            ))}
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}
