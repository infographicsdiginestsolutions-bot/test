'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Reveal, ParallaxLayer } from '../ScrollEffects';

const solutions = [
  {
    id: 'residential',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <path d="M8 20L24 6L40 20V42H30V30H18V42H8V20Z" stroke="url(#g1)" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <rect x="19" y="30" width="10" height="12" stroke="url(#g1)" strokeWidth="2" fill="none" />
        <path d="M14 28h6M28 28h6" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f5a623" /><stop offset="1" stopColor="#ff6b2b" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Residential Solar',
    subtitle: 'Smart Home Energy',
    description: 'Transform your home into a self-sustaining energy hub with our precision-engineered rooftop solar systems.',
    features: ['Customized rooftop systems', 'Lower monthly electricity bills', 'Smart energy monitoring'],
    stat: 'Up to 90% bill reduction',
    color: 'from-orange-500/10 to-amber-500/5',
    border: 'border-orange-500/20',
  },
  {
    id: 'commercial',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <rect x="6" y="12" width="36" height="30" rx="2" stroke="url(#g2)" strokeWidth="2" fill="none" />
        <path d="M14 12V6h20v6" stroke="url(#g2)" strokeWidth="2" strokeLinejoin="round" />
        <line x1="24" y1="12" x2="24" y2="42" stroke="url(#g2)" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="12" y="20" width="8" height="6" rx="1" stroke="url(#g2)" strokeWidth="1.5" fill="none" />
        <rect x="28" y="20" width="8" height="6" rx="1" stroke="url(#g2)" strokeWidth="1.5" fill="none" />
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f5a623" /><stop offset="1" stopColor="#ff6b2b" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Commercial Solar',
    subtitle: 'Business Energy Solutions',
    description: 'Scale your business with intelligent solar installations that reduce operating costs and enhance sustainability credentials.',
    features: ['Scalable business installations', 'Reduced operational expenses', 'Sustainability compliance'],
    stat: 'Average 60% OpEx reduction',
    color: 'from-amber-500/10 to-yellow-500/5',
    border: 'border-amber-500/20',
    featured: true,
  },
  {
    id: 'industrial',
    icon: (
      <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
        <path d="M4 38V22l12-8v8l12-8v8l12-8v24H4z" stroke="url(#g3)" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <line x1="4" y1="38" x2="44" y2="38" stroke="url(#g3)" strokeWidth="2" />
        <path d="M20 38v-8h8v8" stroke="url(#g3)" strokeWidth="2" strokeLinejoin="round" />
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f5a623" /><stop offset="1" stopColor="#ff6b2b" />
          </linearGradient>
        </defs>
      </svg>
    ),
    title: 'Industrial Solutions',
    subtitle: 'Large-Scale Infrastructure',
    description: 'Engineer massive energy independence with our industrial-grade solar infrastructure designed for maximum output and ROI.',
    features: ['Large-scale energy infrastructure', 'High-efficiency engineering', 'Long-term ROI optimization'],
    stat: 'MW-scale installations',
    color: 'from-red-500/10 to-orange-500/5',
    border: 'border-red-500/20',
  },
];

export default function Solutions() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  // Background orb parallax
  const orbY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const orbScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);

  return (
    <section ref={sectionRef} id="solutions" className="relative py-32 overflow-hidden" style={{ background: '#050810' }}>
      {/* Parallax background orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          y: orbY,
          scale: orbScale,
          background: 'radial-gradient(circle, rgba(245,166,35,0.06), transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header with parallax */}
        <ParallaxLayer speed={0.15} className="text-center mb-20">
          <Reveal direction="up">
            <span className="inline-block text-xs font-medium text-[#f5a623] tracking-widest uppercase mb-4 glass-warm px-4 py-2 rounded-full">
              Our Solutions
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
              Solar for Every <span className="gradient-text">Scale</span>
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              From rooftop systems to industrial megaprojects — we engineer solar solutions that deliver measurable results.
            </p>
          </Reveal>
        </ParallaxLayer>

        {/* Cards with staggered scroll-reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {solutions.map((solution, i) => (
            <Reveal key={solution.id} direction="up" delay={i * 0.12} amount={0.1}>
              <motion.div
                whileHover={{ y: -12, transition: { duration: 0.35, ease: 'easeOut' } }}
                className={`relative group rounded-3xl p-8 border cursor-pointer overflow-hidden h-full ${solution.border} bg-gradient-to-br ${solution.color}`}
                style={{ backdropFilter: 'blur(20px)' }}
                data-magnetic
              >
                {solution.featured && (
                  <div className="absolute top-5 right-5 gradient-bg text-black text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                {/* Mouse-follow inner glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(245,166,35,0.12), transparent 60%)' }} />

                {/* Shimmer sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer rounded-3xl" />

                {/* Icon with spin-on-hover */}
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="mb-6 inline-block p-3 rounded-2xl glass border border-white/10"
                >
                  {solution.icon}
                </motion.div>

                <div className="text-xs text-[#f5a623]/70 uppercase tracking-widest mb-2">{solution.subtitle}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{solution.description}</p>

                <ul className="space-y-3 mb-8">
                  {solution.features.map((f, fi) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + fi * 0.08 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 text-sm text-white/60"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: fi * 0.5 }}
                        className="w-1.5 h-1.5 rounded-full bg-[#f5a623] flex-shrink-0"
                      />
                      {f}
                    </motion.li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-white/5">
                  <div className="text-xs text-white/30 mb-1">Performance</div>
                  <div className="text-sm font-semibold gradient-text">{solution.stat}</div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`mt-6 w-full py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    solution.featured
                      ? 'gradient-bg text-black solar-glow-sm'
                      : 'glass border border-white/10 text-white hover:border-white/20'
                  }`}
                >
                  Learn More →
                </motion.button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
