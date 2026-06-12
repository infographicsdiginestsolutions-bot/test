'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';

/* ── Context ── */
interface ScrollContextValue {
  scrollY: number;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
  velocity: number;
}

const ScrollContext = createContext<ScrollContextValue>({
  scrollY: 0, scrollProgress: 0, mouseX: 0, mouseY: 0, velocity: 0,
});

export function useScrollContext() { return useContext(ScrollContext); }

/* ── Provider ── */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<ScrollContextValue>({
    scrollY: 0, scrollProgress: 0, mouseX: 0, mouseY: 0, velocity: 0,
  });
  const lastScroll = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const now = Date.now();
      const dt = Math.max(now - lastTime.current, 1);
      const vel = Math.abs(sy - lastScroll.current) / dt;
      const progress = sy / (document.body.scrollHeight - window.innerHeight);
      lastScroll.current = sy;
      lastTime.current = now;
      setValues(v => ({ ...v, scrollY: sy, scrollProgress: progress, velocity: vel }));
    };
    const onMouse = (e: MouseEvent) => {
      setValues(v => ({
        ...v,
        mouseX: (e.clientX / window.innerWidth - 0.5) * 2,
        mouseY: (e.clientY / window.innerHeight - 0.5) * 2,
      }));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <ScrollContext.Provider value={values}>{children}</ScrollContext.Provider>;
}

/* ── Magnetic cursor ── */
export function MagneticCursor() {
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const rx = useMotionValue(-100);
  const ry = useMotionValue(-100);

  const sx = useSpring(cx, { stiffness: 500, damping: 28 });
  const sy = useSpring(cy, { stiffness: 500, damping: 28 });
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cx.set(e.clientX); cy.set(e.clientY);
      rx.set(e.clientX); ry.set(e.clientY);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setIsHovering(!!(el?.closest('button, a, [data-magnetic]')));
    };
    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [cx, cy, rx, ry]);

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          animate={{ scale: isClicking ? 0.5 : isHovering ? 1.8 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="w-3 h-3 rounded-full bg-white"
        />
      </motion.div>
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: srx, y: sry, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.7 : isHovering ? 2.2 : 1,
            opacity: isHovering ? 0.5 : 0.25,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="w-9 h-9 rounded-full border border-[#f5a623]"
        />
      </motion.div>
    </>
  );
}

/* ── Section reveal wrapper ── */
interface RevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
  delay?: number;
  className?: string;
  amount?: number;
}

export function Reveal({ children, direction = 'up', delay = 0, className = '', amount = 0.15 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: amount }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [amount]);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
      x: direction === 'left' ? 60 : direction === 'right' ? -60 : 0,
      scale: direction === 'scale' ? 0.85 : 1,
    },
    visible: { opacity: 1, y: 0, x: 0, scale: 1 },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={visible ? 'visible' : 'hidden'}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Parallax wrapper ── */
export function ParallaxLayer({ children, speed = 0.3, className = '' }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const sy = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      y.set(-center * speed);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed, y]);

  return (
    <motion.div ref={ref} style={{ y: sy }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Scroll velocity skew ── */
export function VelocitySkew({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { velocity } = useScrollContext();
  const skew = useSpring(0, { stiffness: 100, damping: 20 });

  useEffect(() => {
    skew.set(Math.min(velocity * 3, 8));
    const t = setTimeout(() => skew.set(0), 300);
    return () => clearTimeout(t);
  }, [velocity, skew]);

  return (
    <motion.div style={{ skewY: skew }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Horizontal scroll ticker ── */
export function ScrollTicker({ items, speed = 40 }: { items: string[]; speed?: number }) {
  const text = [...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap py-4 select-none">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        className="inline-flex gap-12"
      >
        {text.map((item, i) => (
          <span key={i} className="text-sm font-medium text-white/20 uppercase tracking-widest inline-flex items-center gap-4">
            <span className="w-1 h-1 rounded-full bg-[#f5a623] inline-block" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
