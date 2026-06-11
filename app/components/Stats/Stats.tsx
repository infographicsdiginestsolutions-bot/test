'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 150, suffix: ' MW+', label: 'Installed Capacity', description: 'Across all deployments' },
  { value: 10000, suffix: '+', label: 'Projects Completed', description: 'Residential & commercial' },
  { value: 25, suffix: '+', label: 'Years of Expertise', description: 'Industry experience' },
  { value: 120, suffix: '+', label: 'Certified Engineers', description: 'In-house specialists' },
];

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span className="gradient-text">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} id="why-us" className="relative py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #0a0f1e 50%, #050810 100%)' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(245,166,35,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-medium text-[#f5a623] tracking-widest uppercase mb-4 glass-warm px-4 py-2 rounded-full">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            Proven at <span className="gradient-text">Scale</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Numbers that speak to our commitment — every installation, every megawatt, every satisfied client.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-warm rounded-3xl p-8 text-center border border-[#f5a623]/10 relative group overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle at center, rgba(245,166,35,0.08), transparent 70%)' }} />

              <div className="text-4xl md:text-5xl font-bold mb-3">
                <CountUp target={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <div className="text-base font-semibold text-white mb-1">{stat.label}</div>
              <div className="text-xs text-white/30">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Extra features row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: '🏆', title: 'Award-Winning', desc: 'Multiple industry awards for excellence and innovation in renewable energy' },
            { icon: '🔒', title: '25-Year Warranty', desc: 'Industry-leading warranty on all panels and workmanship' },
            { icon: '⚡', title: '24/7 Monitoring', desc: 'Real-time system monitoring with AI-powered performance optimization' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 flex items-start gap-4 border border-white/5"
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-white mb-1">{item.title}</div>
                <div className="text-sm text-white/40">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
