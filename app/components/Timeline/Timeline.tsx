'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Reveal, ParallaxLayer } from '../ScrollEffects';

const steps = [
  { number: '01', title: 'Consultation', description: 'Free expert consultation to understand your energy needs, goals, and current usage patterns.', icon: '💬', duration: '1-2 days' },
  { number: '02', title: 'Site Assessment', description: 'Our engineers conduct a thorough on-site evaluation including roof inspection and solar irradiance mapping.', icon: '📐', duration: '1 day' },
  { number: '03', title: 'System Design', description: 'Custom solar system design optimized for maximum output, aesthetics, and ROI using advanced simulation.', icon: '🎨', duration: '3-5 days' },
  { number: '04', title: 'Installation', description: 'Professional installation by certified engineers with minimal disruption to your operations.', icon: '🔧', duration: '1-3 days' },
  { number: '05', title: 'Activation', description: 'System commissioning, grid connection, and verification of full operational performance.', icon: '⚡', duration: '1 day' },
  { number: '06', title: 'Ongoing Support', description: "24/7 monitoring, predictive maintenance, and dedicated support throughout your system's lifetime.", icon: '🛡️', duration: '25+ years' },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  // Progress line fills as you scroll through the section
  const lineScaleY = useTransform(scrollYProgress, [0.05, 0.9], [0, 1]);
  const smoothLine = useSpring(lineScaleY, { stiffness: 80, damping: 20 });

  // Section background hue shift
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <section ref={sectionRef} id="process" className="relative py-32 overflow-hidden" style={{ background: '#050810' }}>
      {/* Scroll-driven radial pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: bgOpacity,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(245,166,35,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-6">
        <ParallaxLayer speed={0.1} className="text-center mb-20">
          <Reveal direction="up">
            <span className="inline-block text-xs font-medium text-[#f5a623] tracking-widest uppercase mb-4 glass-warm px-4 py-2 rounded-full">
              How It Works
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
              Your Solar <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              From first call to full energy independence — a seamless, supported process every step of the way.
            </p>
          </Reveal>
        </ParallaxLayer>

        <div className="relative">
          {/* Static background line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />

          {/* Scroll-driven fill line */}
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-px -translate-x-1/2 origin-top"
            style={{
              height: '100%',
              scaleY: smoothLine,
              background: 'linear-gradient(to bottom, #f5a623, #ff6b2b, #f5a623)',
            }}
          />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <Reveal key={step.number} direction={i % 2 === 0 ? 'left' : 'right'} delay={0.05} amount={0.3}>
                <div className={`relative flex items-start gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
                  {/* Animated node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      whileInView={{ scale: [0, 1.3, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      whileHover={{ scale: 1.3, boxShadow: '0 0 20px rgba(245,166,35,0.6)' }}
                      className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-black font-bold text-xs solar-glow-sm cursor-default"
                    >
                      {step.number}
                    </motion.div>
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 pl-20 md:pl-0 ${i % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.25 } }}
                      className="glass rounded-2xl p-6 border border-white/5 hover:border-[#f5a623]/20 transition-colors duration-300 cursor-default"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <motion.span
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                          className="text-2xl"
                        >
                          {step.icon}
                        </motion.span>
                        <div>
                          <div className="font-bold text-white text-lg">{step.title}</div>
                          <div className="text-xs text-[#f5a623]/70">{step.duration}</div>
                        </div>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>

                      {/* Progress bar for each step */}
                      <div className="mt-4 h-px bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #f5a623, #ff6b2b)' }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${70 + i * 5}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div className="hidden md:block flex-1" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
