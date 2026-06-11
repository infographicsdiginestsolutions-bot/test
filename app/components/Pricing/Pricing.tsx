'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const plans = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Ideal for homes',
    price: '$8,999',
    period: 'starting from',
    description: 'Everything you need for a smart residential solar setup with monitoring.',
    color: 'border-white/10',
    features: [
      { text: 'Up to 8 kW system', included: true },
      { text: 'Premium monocrystalline panels', included: true },
      { text: 'Smart monitoring app', included: true },
      { text: '25-year panel warranty', included: true },
      { text: '10-year workmanship warranty', included: true },
      { text: 'Battery storage add-on', included: false },
      { text: 'EV charger integration', included: false },
      { text: 'Dedicated account manager', included: false },
    ],
    cta: 'Get Started',
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Best for growing businesses',
    price: '$24,999',
    period: 'starting from',
    description: 'Advanced solar solution with battery storage and smart grid integration.',
    color: 'border-[#f5a623]/40',
    popular: true,
    features: [
      { text: 'Up to 50 kW system', included: true },
      { text: 'High-efficiency bifacial panels', included: true },
      { text: 'Advanced analytics platform', included: true },
      { text: '25-year panel warranty', included: true },
      { text: '15-year workmanship warranty', included: true },
      { text: 'Battery storage included', included: true },
      { text: 'EV charger integration', included: true },
      { text: 'Dedicated account manager', included: false },
    ],
    cta: 'Most Popular Choice',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Custom industrial solutions',
    price: 'Custom',
    period: 'tailored pricing',
    description: 'Full-scale industrial deployments with engineering, O&M, and financing.',
    color: 'border-white/10',
    features: [
      { text: 'Unlimited system size', included: true },
      { text: 'Premium industrial panels', included: true },
      { text: 'SCADA monitoring system', included: true },
      { text: '25-year panel warranty', included: true },
      { text: 'Custom workmanship SLA', included: true },
      { text: 'Multi-site battery storage', included: true },
      { text: 'Full grid integration', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
    cta: 'Contact Sales Team',
  },
];

export default function Pricing() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} id="pricing" className="relative py-32" style={{ background: '#050810' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-medium text-[#f5a623] tracking-widest uppercase mb-4 glass-warm px-4 py-2 rounded-full">
            Pricing Packages
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            No hidden fees. No surprises. Just clean energy at fair prices with world-class service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`relative rounded-3xl border ${plan.color} transition-all duration-300 ${
                plan.popular ? 'glass-warm solar-glow' : 'glass'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-bg text-black text-xs font-bold px-5 py-1.5 rounded-full whitespace-nowrap">
                  ⭐ Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="text-xs text-[#f5a623]/60 uppercase tracking-widest mb-2">{plan.tagline}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                </div>
                <div className="text-xs text-white/30 mb-6">{plan.period}</div>
                <p className="text-sm text-white/50 leading-relaxed mb-8">{plan.description}</p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 mb-6 ${
                    plan.popular
                      ? 'gradient-bg text-black solar-glow-sm'
                      : 'glass border border-white/10 text-white hover:border-white/20'
                  }`}
                >
                  {plan.cta}
                </motion.button>

                <div className="space-y-3">
                  {plan.features.slice(0, expanded === plan.id ? undefined : 5).map((feature) => (
                    <div key={feature.text} className="flex items-center gap-3 text-sm">
                      {feature.included ? (
                        <div className="w-4 h-4 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-px bg-white/30" />
                        </div>
                      )}
                      <span className={feature.included ? 'text-white/70' : 'text-white/25 line-through'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.features.length > 5 && (
                  <button
                    onClick={() => setExpanded(expanded === plan.id ? null : plan.id)}
                    className="mt-4 text-xs text-[#f5a623]/60 hover:text-[#f5a623] transition-colors"
                  >
                    {expanded === plan.id ? '↑ Show less' : `+ ${plan.features.length - 5} more features`}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-white/30 mt-12"
        >
          All prices exclude applicable taxes. Federal and state incentives may significantly reduce your total cost.
          <br />Financing options available with 0% APR for qualified applicants.
        </motion.p>
      </div>
    </section>
  );
}
