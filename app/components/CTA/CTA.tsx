'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function CTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-40 overflow-hidden" style={{ background: '#050810' }}>
      {/* Animated sunburst */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[600px] h-[600px]">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                width: '50%',
                height: '2px',
                background: `linear-gradient(to right, rgba(245,166,35,${0.15 - i * 0.005}), transparent)`,
                transform: `translate(-50%, -50%) rotate(${i * 22.5}deg)`,
              }}
              animate={{
                scaleX: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
          {/* Pulsing orb */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
            style={{ background: 'radial-gradient(circle, #f5a623, #ff6b2b 50%, transparent 100%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.06) 0%, transparent 70%)',
      }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass-warm rounded-full px-4 py-2 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse" />
            <span className="text-xs font-medium text-[#f5a623] tracking-wider uppercase">
              Start Today
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-8"
          >
            <span className="text-white">Start Your</span>
            <br />
            <span className="gradient-text">Solar Journey</span>
            <br />
            <span className="text-white">Today</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-14 leading-relaxed"
          >
            Join over 10,000 homes and businesses that have already made the switch
            to clean, reliable solar energy. Your free assessment takes just 30 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(245,166,35,0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 rounded-full font-bold text-black gradient-bg solar-glow text-base min-w-[280px] transition-all duration-300"
            >
              Schedule a Free Assessment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 rounded-full font-medium text-white glass border border-white/10 hover:border-white/20 text-base min-w-[240px] transition-all duration-300"
            >
              Speak with an Energy Expert
            </motion.button>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/30"
          >
            {[
              '✓ No obligation',
              '✓ Same-day response',
              '✓ Expert consultation',
              '✓ 0% financing available',
            ].map((item) => (
              <span key={item} className="text-white/40">{item}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
