'use client';

import { useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Reveal, ParallaxLayer } from '../ScrollEffects';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function EnergyFlow({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (Math.sin(clock.elapsedTime * 2) + 1) / 2;
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + t * 1.5;
    }
  });

  const s = new THREE.Vector3(...start);
  const e = new THREE.Vector3(...end);
  const length = s.distanceTo(e);
  const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);

  return (
    <mesh ref={ref} position={mid.toArray() as [number, number, number]}>
      <boxGeometry args={[length, 0.02, 0.02]} />
      <meshStandardMaterial color="#f5a623" emissive="#f5a623" emissiveIntensity={1} />
    </mesh>
  );
}

function CinematicPanel({ position, hovered }: { position: [number, number, number]; hovered: boolean }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!ref.current) return;
    const targetX = hovered ? -0.1 : -0.2;
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.05;
  });

  return (
    <group ref={ref} position={position} rotation={[-0.2, 0, 0]}>
      <mesh>
        <boxGeometry args={[2.4, 0.06, 1.5]} />
        <meshStandardMaterial color="#0d1b2a" metalness={0.95} roughness={0.05} />
      </mesh>
      {Array.from({ length: 4 }).map((_, col) =>
        Array.from({ length: 3 }).map((_, row) => (
          <mesh key={`${col}-${row}`} position={[(col - 1.5) * 0.55, 0.05, (row - 1) * 0.46]}>
            <boxGeometry args={[0.48, 0.02, 0.4]} />
            <meshStandardMaterial
              color="#061020"
              metalness={0.8}
              roughness={0.2}
              emissive={hovered ? '#3060c0' : '#1e4080'}
              emissiveIntensity={hovered ? 0.8 : 0.3}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

function BannerScene({ hovered }: { hovered: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 6, 4]} intensity={hovered ? 3 : 1.5} color="#ffcc88" />
      <pointLight position={[0, 3, 0]} intensity={hovered ? 2 : 0.5} color="#f5a623" />
      <Environment preset="night" />

      <Float speed={0.8} floatIntensity={0.2}>
        <CinematicPanel position={[-3, 0, 0]} hovered={hovered} />
      </Float>
      <Float speed={0.6} floatIntensity={0.15}>
        <CinematicPanel position={[0, 0.3, -0.5]} hovered={hovered} />
      </Float>
      <Float speed={1} floatIntensity={0.25}>
        <CinematicPanel position={[3, 0, 0]} hovered={hovered} />
      </Float>

      <EnergyFlow start={[-2.5, 0.1, 0]} end={[-0.6, 0.1, 0]} />
      <EnergyFlow start={[0.6, 0.1, 0]} end={[2.5, 0.1, 0]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#050810" metalness={0.5} roughness={0.8} />
      </mesh>
    </>
  );
}

export default function Banner3D() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const canvasY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section ref={ref} className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050810, #0a0f1e, #050810)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <ParallaxLayer speed={0.1} className="text-center mb-12">
          <Reveal direction="up">
            <span className="inline-block text-xs font-medium text-[#f5a623] tracking-widest uppercase mb-4 glass-warm px-4 py-2 rounded-full">
              Advanced Technology
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
              Next-Generation <span className="gradient-text">Solar Infrastructure</span>
            </h2>
          </Reveal>
        </ParallaxLayer>

        <Reveal direction="scale" delay={0.1}>
        <motion.div
          style={{ y: canvasY }}
          className="relative h-[400px] rounded-3xl overflow-hidden glass border border-white/5 cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Canvas camera={{ position: [0, 2, 7], fov: 50 }} gl={{ antialias: true, alpha: true }}>
            <BannerScene hovered={hovered} />
          </Canvas>

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
            <div className="glass rounded-2xl px-5 py-3">
              <div className="text-xs text-white/40 uppercase tracking-wide mb-1">Live System Output</div>
              <div className="text-2xl font-bold gradient-text">847 kW</div>
            </div>
            <div className="glass rounded-2xl px-5 py-3">
              <div className="text-xs text-white/40 uppercase tracking-wide mb-1">Efficiency</div>
              <div className="text-2xl font-bold text-white">22.8%</div>
            </div>
            <div className="glass rounded-2xl px-5 py-3 hidden md:block">
              <div className="text-xs text-white/40 uppercase tracking-wide mb-1">CO₂ Offset Today</div>
              <div className="text-2xl font-bold text-emerald-400">1.2 tons</div>
            </div>
          </div>

          <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5 text-xs text-white/40">
            Hover to interact
          </div>
        </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
