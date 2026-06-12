'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Reveal, ParallaxLayer, VelocitySkew } from '../ScrollEffects';

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
    const steps = 60;
    const inc = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 2000 / steps);
    return () => clearInterval(t);
  }, [inView, target]);

  return <span className="gradient-text">{count.toLocaleString()}{suffix}</span>;
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(statsRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const gridY = useTransform(scrollYProgress, [0, 1], ['0px', '60px']);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.05, 0.05, 0]);

  return (
    <section ref={sectionRef} id="why-us" className="relative py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810 0%, #0a0f1e 50%, #050810 100%)' }}
    >
      {/* Parallax grid */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: gridY,
          opacity: gridOpacity,
          backgroundImage: 'linear-gradient(rgba(245,166,35,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ParallaxLayer speed={0.12} className="text-center mb-20">
          <Reveal direction="up">
            <span className="inline-block text-xs font-medium text-[#f5a623] tracking-widest uppercase mb-4 glass-warm px-4 py-2 rounded-full">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
              Proven at <span className="gradient-text">Scale</span>
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              Numbers that speak to our commitment — every installation, every megawatt, every satisfied client.
            </p>
          </Reveal>
        </ParallaxLayer>

        {/* Stat cards with velocity skew */}
        <VelocitySkew>
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} direction="up" delay={i * 0.1} amount={0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
                  className="glass-warm rounded-3xl p-8 text-center border border-[#f5a623]/10 relative group overflow-hidden h-full"
                >
                  {/* Glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(circle at center, rgba(245,166,35,0.12), transparent 65%)' }}
                  />
                  {/* Animated ring */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border border-[#f5a623]/0 group-hover:border-[#f5a623]/30 transition-all duration-500"
                  />

                  <div className="text-4xl md:text-5xl font-bold mb-3">
                    <CountUp target={stat.value} suffix={stat.suffix} inView={inView} />
                  </div>
                  <div className="text-base font-semibold text-white mb-1">{stat.label}</div>
                  <div className="text-xs text-white/30">{stat.description}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </VelocitySkew>

        {/* Feature pills */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🏆', title: 'Award-Winning', desc: 'Multiple industry awards for excellence and innovation in renewable energy' },
            { icon: '🔒', title: '25-Year Warranty', desc: 'Industry-leading warranty on all panels and workmanship' },
            { icon: '⚡', title: '24/7 Monitoring', desc: 'Real-time system monitoring with AI-powered performance optimization' },
          ].map((item, i) => (
            <Reveal key={i} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-2xl p-6 flex items-start gap-4 border border-white/5 hover:border-white/10 transition-colors duration-300"
              >
                <motion.span
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i }}
                  className="text-3xl"
                >
                  {item.icon}
                </motion.span>
                <div>
                  <div className="font-semibold text-white mb-1">{item.title}</div>
                  <div className="text-sm text-white/40">{item.desc}</div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
