'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Consultation',
    description: 'Free expert consultation to understand your energy needs, goals, and current usage patterns.',
    icon: '💬',
    duration: '1-2 days',
  },
  {
    number: '02',
    title: 'Site Assessment',
    description: 'Our engineers conduct a thorough on-site evaluation including roof inspection and solar irradiance mapping.',
    icon: '📐',
    duration: '1 day',
  },
  {
    number: '03',
    title: 'System Design',
    description: 'Custom solar system design optimized for maximum output, aesthetics, and ROI using advanced simulation.',
    icon: '🎨',
    duration: '3-5 days',
  },
  {
    number: '04',
    title: 'Installation',
    description: 'Professional installation by certified engineers with minimal disruption to your operations.',
    icon: '🔧',
    duration: '1-3 days',
  },
  {
    number: '05',
    title: 'Activation',
    description: 'System commissioning, grid connection, and verification of full operational performance.',
    icon: '⚡',
    duration: '1 day',
  },
  {
    number: '06',
    title: 'Ongoing Support',
    description: '24/7 monitoring, predictive maintenance, and dedicated support throughout your system\'s lifetime.',
    icon: '🛡️',
    duration: '25+ years',
  },
];

export default function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

  return (
    <section ref={ref} id="process" className="relative py-32" style={{ background: '#050810' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-medium text-[#f5a623] tracking-widest uppercase mb-4 glass-warm px-4 py-2 rounded-full">
            How It Works
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            Your Solar <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            From first call to full energy independence — a seamless, supported process every step of the way.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />
          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-px -translate-x-1/2 origin-top"
            style={{
              height: lineHeight,
              background: 'linear-gradient(to bottom, #f5a623, #ff6b2b)',
            }}
          />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className={`relative flex items-start gap-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-row`}
              >
                {/* Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    whileInView={{ scale: [0.5, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-black font-bold text-xs solar-glow-sm"
                  >
                    {step.number}
                  </motion.div>
                </div>

                {/* Content */}
                <div className={`flex-1 pl-20 md:pl-0 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="glass rounded-2xl p-6 border border-white/5 hover:border-[#f5a623]/20 transition-all duration-300 inline-block w-full"
                  >
                    <div className="flex items-center gap-3 mb-3 md:justify-start">
                      <span className="text-2xl">{step.icon}</span>
                      <div>
                        <div className="font-bold text-white text-lg">{step.title}</div>
                        <div className="text-xs text-[#f5a623]/70">{step.duration}</div>
                      </div>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                  </motion.div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
