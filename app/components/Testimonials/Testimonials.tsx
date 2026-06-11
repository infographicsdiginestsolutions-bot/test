'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Homeowner, California',
    avatar: 'SC',
    rating: 5,
    text: 'Solaris Energy transformed our home\'s energy consumption completely. Our electricity bills dropped by 87% in the first month. The team was professional, the installation was seamless, and the monitoring app is incredible.',
    savings: '$2,400/year saved',
    system: '12 kW Residential System',
    color: 'from-orange-500/20 to-amber-500/10',
  },
  {
    name: 'Marcus Johnson',
    role: 'CEO, TechVentures Inc.',
    avatar: 'MJ',
    rating: 5,
    text: 'We installed a 500 kW commercial system across our three facilities. The ROI has been phenomenal — we recovered our investment in under 5 years. Solaris\'s engineering team is world-class.',
    savings: '$180,000/year saved',
    system: '500 kW Commercial Array',
    color: 'from-amber-500/20 to-yellow-500/10',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Operations Director, GreenMfg',
    avatar: 'ER',
    rating: 5,
    text: 'The industrial installation was completed ahead of schedule with zero production downtime. Solaris delivered exactly what they promised — a 2 MW system that now powers 70% of our manufacturing plant.',
    savings: '$850,000/year saved',
    system: '2 MW Industrial Installation',
    color: 'from-red-500/20 to-orange-500/10',
  },
  {
    name: 'David Park',
    role: 'Homeowner, Texas',
    avatar: 'DP',
    rating: 5,
    text: 'After the 2021 winter storm, I knew I needed energy independence. Solaris installed a solar + battery system that keeps my home powered through any outage. Best investment I\'ve ever made.',
    savings: '$1,800/year saved',
    system: '8 kW + Battery Storage',
    color: 'from-blue-500/20 to-indigo-500/10',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill={i < rating ? '#f5a623' : 'none'} stroke="#f5a623" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      setActive((a) => (a + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <section ref={ref} id="testimonials" className="relative py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050810, #0a0f1e, #050810)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-medium text-[#f5a623] tracking-widest uppercase mb-4 glass-warm px-4 py-2 rounded-full">
            Client Stories
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            Real Results, <span className="gradient-text">Real Savings</span>
          </h2>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className={`rounded-3xl p-10 md:p-14 bg-gradient-to-br ${testimonials[active].color} border border-white/10 relative overflow-hidden`}
            >
              {/* Quote mark */}
              <div className="absolute top-8 right-10 text-8xl font-serif text-white/5 leading-none">"</div>

              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-black font-bold text-xl flex-shrink-0">
                  {testimonials[active].avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">{testimonials[active].name}</div>
                  <div className="text-white/40 text-sm">{testimonials[active].role}</div>
                  <div className="mt-2"><StarRating rating={testimonials[active].rating} /></div>
                </div>
                <div className="ml-auto text-right hidden md:block">
                  <div className="text-2xl font-bold gradient-text">{testimonials[active].savings}</div>
                  <div className="text-xs text-white/30 mt-1">{testimonials[active].system}</div>
                </div>
              </div>

              <blockquote className="text-white/80 text-lg md:text-xl leading-relaxed max-w-3xl">
                "{testimonials[active].text}"
              </blockquote>

              <div className="mt-6 md:hidden">
                <div className="text-xl font-bold gradient-text">{testimonials[active].savings}</div>
                <div className="text-xs text-white/30">{testimonials[active].system}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Carousel dots + mini cards */}
        <div className="flex flex-wrap gap-4 justify-center">
          {testimonials.map((t, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.03 }}
              className={`glass rounded-2xl p-4 flex items-center gap-3 border transition-all duration-300 text-left ${
                i === active ? 'border-[#f5a623]/50 glass-warm' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                i === active ? 'gradient-bg text-black' : 'bg-white/10 text-white'
              }`}>
                {t.avatar}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-white">{t.name}</div>
                <div className="text-xs text-white/30">{t.savings}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
