'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Trail, Sparkles, MeshReflectorMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Sun with corona rings ───────────────────────────────────────── */
function Sun({ scrollY }: { scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);
  const ring3 = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Sun rises as user scrolls
    const rise = scrollY * 6;
    if (groupRef.current) groupRef.current.position.y = 4 + rise;

    // Pulsing core
    const pulse = 1 + Math.sin(t * 1.2) * 0.06;
    if (coreRef.current) coreRef.current.scale.setScalar(pulse);

    // Rotating corona rings
    if (ring1.current) ring1.current.rotation.z = t * 0.3;
    if (ring2.current) ring2.current.rotation.z = -t * 0.2;
    if (ring3.current) ring3.current.rotation.z = t * 0.15;
  });

  return (
    <group ref={groupRef} position={[0, 4, -14]}>
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial
          color="#fff5cc"
          emissive="#ffaa00"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow layers */}
      {[3.2, 4.8, 7.5].map((r, i) => (
        <mesh key={i}>
          <sphereGeometry args={[r, 32, 32]} />
          <meshStandardMaterial
            color="#ff8800"
            transparent
            opacity={0.06 - i * 0.015}
            side={THREE.BackSide}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Rotating corona rings */}
      {[
        { ref: ring1, r: 2.2, tube: 0.04, color: '#ffcc44' },
        { ref: ring2, r: 2.8, tube: 0.025, color: '#ff9922' },
        { ref: ring3, r: 3.4, tube: 0.015, color: '#ff6600' },
      ].map(({ ref, r, tube, color }, i) => (
        <mesh key={i} ref={ref} rotation={[Math.PI / 2 + i * 0.3, 0, 0]}>
          <torusGeometry args={[r, tube, 16, 100]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      ))}

      {/* Lights */}
      <pointLight color="#ffaa33" intensity={12} distance={50} />
      <pointLight color="#ff6600" intensity={6} distance={80} />
    </group>
  );
}

/* ─── Single panel with shimmer ──────────────────────────────────── */
function SolarPanel({
  position,
  baseRotX,
  mouseX,
  mouseY,
  scrollY,
  index,
}: {
  position: [number, number, number];
  baseRotX: number;
  mouseX: number;
  mouseY: number;
  scrollY: number;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const emissiveRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    // Gentle wave across the field
    const wave = Math.sin(t * 0.6 + index * 0.4) * 0.04;

    // Mouse tilt (parallax)
    const targetX = baseRotX + mouseY * 0.12 + wave;
    const targetY = mouseX * 0.1;

    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.06;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.06;

    // Scroll: panels tilt back and rise
    groupRef.current.position.y = position[1] + scrollY * 1.5 * (1 + index * 0.05);

    // Shimmer on cells
    if (emissiveRef.current) {
      emissiveRef.current.emissiveIntensity = 0.2 + Math.abs(Math.sin(t * 0.8 + index)) * 0.6;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[baseRotX, 0, 0]}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.4, 0.06, 1.6]} />
        <meshStandardMaterial color="#12182e" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Cell grid — 4×3 */}
      {Array.from({ length: 4 }).map((_, col) =>
        Array.from({ length: 3 }).map((_, row) => (
          <mesh key={`${col}-${row}`} position={[(col - 1.5) * 0.56, 0.05, (row - 1) * 0.5]}>
            <boxGeometry args={[0.5, 0.015, 0.43]} />
            <meshStandardMaterial
              ref={col === 0 && row === 0 ? emissiveRef : undefined}
              color="#050e1f"
              metalness={0.75}
              roughness={0.18}
              emissive="#2060d0"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))
      )}

      {/* Reflective top coat */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[2.36, 0.004, 1.56]} />
        <meshStandardMaterial
          color="#aaccff"
          metalness={1}
          roughness={0.05}
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Mount pole */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.035, 0.055, 1, 8]} />
        <meshStandardMaterial color="#1e2030" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Base plate */}
      <mesh position={[0, -1.07, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.3, 0.04, 0.3]} />
        <meshStandardMaterial color="#1a1c28" metalness={0.85} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ─── Full panel field ────────────────────────────────────────────── */
function SolarField({ mouseX, mouseY, scrollY }: { mouseX: number; mouseY: number; scrollY: number }) {
  const panels = useMemo(() => {
    const items: { position: [number, number, number]; baseRotX: number; index: number }[] = [];
    let idx = 0;
    for (let col = -3; col <= 3; col++) {
      for (let row = -1; row <= 1; row++) {
        items.push({
          position: [col * 3.0, -0.2 + row * 0.1, row * 2.8 - col * 0.15],
          baseRotX: -0.28 + row * 0.03,
          index: idx++,
        });
      }
    }
    return items;
  }, []);

  return (
    <>
      {panels.map((p, i) => (
        <SolarPanel
          key={i}
          position={p.position}
          baseRotX={p.baseRotX}
          mouseX={mouseX}
          mouseY={mouseY}
          scrollY={scrollY}
          index={p.index}
        />
      ))}
    </>
  );
}

/* ─── Orbiting energy drone spheres ──────────────────────────────── */
function EnergyOrbs() {
  const orbs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        radius: 5 + i * 1.2,
        speed: 0.18 + i * 0.07,
        yOff: (i % 3) * 0.8 - 0.8,
        phase: (i / 6) * Math.PI * 2,
        color: i % 2 === 0 ? '#f5a623' : '#80c0ff',
        size: 0.06 + i * 0.01,
      })),
    []
  );

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    orbs.forEach(({ radius, speed, yOff, phase, }, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const t = clock.elapsedTime * speed + phase;
      mesh.position.set(Math.cos(t) * radius, yOff + Math.sin(t * 0.5) * 0.4, Math.sin(t) * radius * 0.5);
    });
  });

  return (
    <>
      {orbs.map(({ color, size }, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[size, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} toneMapped={false} />
          <pointLight color={color} intensity={1.5} distance={4} />
        </mesh>
      ))}
    </>
  );
}

/* ─── Rising energy particles ────────────────────────────────────── */
function EnergyParticles({ scrollY }: { scrollY: number }) {
  const count = 200;
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const c1 = new THREE.Color('#f5a623');
    const c2 = new THREE.Color('#80c8ff');
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 8 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const c = Math.random() > 0.5 ? c1 : c2;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
      sizes[i] = 0.02 + Math.random() * 0.05;
    }
    return { positions, colors, sizes };
  }, []);

  const ref = useRef<THREE.Points>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.008 + scrollY * 0.04;
      pos[i * 3] += Math.sin(t * 0.3 + i) * 0.002;
      if (pos[i * 3 + 1] > 7) pos[i * 3 + 1] = -1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ─── Horizon light beam ─────────────────────────────────────────── */
function HorizonBeam() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.06 + Math.sin(clock.elapsedTime * 0.4) * 0.03;
    }
  });
  return (
    <mesh ref={meshRef} position={[0, -0.4, -8]} rotation={[0, 0, 0]}>
      <planeGeometry args={[60, 6]} />
      <meshStandardMaterial
        color="#ff8800"
        emissive="#ff5500"
        emissiveIntensity={1}
        transparent
        opacity={0.07}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Reflective ground ──────────────────────────────────────────── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
      <planeGeometry args={[60, 30]} />
      <MeshReflectorMaterial
        blur={[400, 150]}
        resolution={512}
        mixBlur={0.9}
        mixStrength={40}
        roughness={1}
        depthScale={1.4}
        minDepthThreshold={0.3}
        maxDepthThreshold={1.6}
        color="#060c1a"
        metalness={0.6}
        mirror={0}
      />
    </mesh>
  );
}

/* ─── Camera: mouse + scroll ─────────────────────────────────────── */
function CameraRig({ mouseX, mouseY, scrollY }: { mouseX: number; mouseY: number; scrollY: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // Scroll zooms forward and tilts up
    const targetZ = 8 - scrollY * 4;
    const targetY = 1.8 + scrollY * 2;
    const targetFovFactor = 1 - scrollY * 0.2;

    camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.025;
    camera.position.y += (targetY + mouseY * 0.8 - camera.position.y) * 0.025;
    camera.position.z += (targetZ - camera.position.z) * 0.04;

    (camera as THREE.PerspectiveCamera).fov +=
      (55 * targetFovFactor - (camera as THREE.PerspectiveCamera).fov) * 0.04;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    camera.lookAt(mouseX * 0.5, 0.5 + scrollY, -2);
  });

  return null;
}

/* ─── Export ──────────────────────────────────────────────────────── */
interface SolarSceneProps {
  mouseX: number;
  mouseY: number;
  scrollY: number;
}

export default function SolarScene({ mouseX, mouseY, scrollY }: SolarSceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.8, 8], fov: 55, near: 0.1, far: 200 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
    >
      <CameraRig mouseX={mouseX} mouseY={mouseY} scrollY={scrollY} />

      {/* Lighting */}
      <ambientLight intensity={0.25} color="#1a2550" />
      <directionalLight
        position={[4, 10, 6]}
        intensity={2.5}
        color="#ffddaa"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <hemisphereLight args={['#1a3060', '#050810', 0.6]} />

      {/* Stars */}
      <Stars radius={120} depth={60} count={4000} factor={3} saturation={0.2} fade speed={0.3} />

      {/* Sparkles floating above field */}
      <Sparkles
        count={80}
        scale={[22, 5, 12]}
        position={[0, 1, -2]}
        size={2}
        speed={0.3}
        color="#f5a623"
        opacity={0.6}
      />
      <Sparkles
        count={40}
        scale={[18, 4, 10]}
        position={[0, 2, -4]}
        size={1.5}
        speed={0.2}
        color="#80c8ff"
        opacity={0.4}
      />

      <Sun scrollY={scrollY} />
      <HorizonBeam />
      <SolarField mouseX={mouseX} mouseY={mouseY} scrollY={scrollY} />
      <EnergyOrbs />
      <EnergyParticles scrollY={scrollY} />
      <Ground />

      <fog attach="fog" args={['#050810', 18, 45]} />
    </Canvas>
  );
}
