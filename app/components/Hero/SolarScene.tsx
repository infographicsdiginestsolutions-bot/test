'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

function SolarPanel({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation[0] + Math.sin(clock.elapsedTime * 0.3) * 0.03;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Panel frame */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2.2, 0.05, 1.4]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Solar cells grid */}
      {Array.from({ length: 4 }).map((_, col) =>
        Array.from({ length: 3 }).map((_, row) => (
          <mesh
            key={`${col}-${row}`}
            position={[
              (col - 1.5) * 0.5,
              0.04,
              (row - 1) * 0.42,
            ]}
          >
            <boxGeometry args={[0.44, 0.01, 0.36]} />
            <meshStandardMaterial
              color="#0a1628"
              metalness={0.7}
              roughness={0.2}
              emissive="#1a3a6e"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))
      )}
      {/* Panel mount */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.7, 8]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function SolarField() {
  const panels = useMemo(() => {
    const items = [];
    for (let i = -2; i <= 2; i++) {
      for (let j = -1; j <= 1; j++) {
        items.push({
          position: [i * 3, 0, j * 2.5] as [number, number, number],
          rotation: [-0.3 + Math.random() * 0.05, (Math.random() - 0.5) * 0.1, 0] as [number, number, number],
        });
      }
    }
    return items;
  }, []);

  return (
    <>
      {panels.map((panel, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0.05} floatIntensity={0.1}>
          <SolarPanel position={panel.position} rotation={panel.rotation} />
        </Float>
      ))}
    </>
  );
}

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 0.5) * 0.05);
    }
  });

  return (
    <group position={[0, 5, -10]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#ffcc44" emissive="#ff8800" emissiveIntensity={2} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshStandardMaterial
          color="#ff8800"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      <pointLight color="#ffaa33" intensity={8} distance={30} />
    </group>
  );
}

function EnergyParticles() {
  const count = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 6 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null!);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.01;
        if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = -1;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f5a623" size={0.04} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
      <planeGeometry args={[40, 20]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={30}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050810"
        metalness={0.5}
        mirror={0}
      />
    </mesh>
  );
}

function CameraController({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 1 + 1.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface SolarSceneProps {
  mouseX: number;
  mouseY: number;
}

export default function SolarScene({ mouseX, mouseY }: SolarSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 55 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <CameraController mouseX={mouseX} mouseY={mouseY} />
      <ambientLight intensity={0.3} color="#1a2040" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
        color="#ffcc88"
        castShadow
      />
      <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />
      <Sun />
      <SolarField />
      <EnergyParticles />
      <Ground />
      <fog attach="fog" args={['#050810', 15, 35]} />
    </Canvas>
  );
}
