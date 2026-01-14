'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { useAppStore } from '@/store/useAppStore';

function FrameLimiter({ fps = 30 }: { fps?: number }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const ms = 1000 / fps;
    const id = window.setInterval(() => invalidate(), ms);
    return () => window.clearInterval(id);
  }, [fps, invalidate]);

  return null;
}

function ParkingGrid() {
  const groupRef = useRef<THREE.Group>(null);

  const slots = useMemo(() => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6'] as const;
    return Array.from({ length: 20 }).map((_, i) => {
      const x = (i % 5) * 2 - 4;
      const z = Math.floor(i / 5) * 2 - 4;
      const c = colors[i % colors.length];
      return { key: i, position: [x, 0, z] as const, color: c };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {slots.map((s) => (
        <mesh key={s.key} position={s.position}>
          <boxGeometry args={[1.5, 0.1, 0.8]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      <mesh rotation={[0, 0, 0]} position={[0, 0.11, 0]}>
        <boxGeometry args={[10, 0.02, 0.1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

export function DarkModeBackground() {
  const theme = useAppStore((s) => s.theme);
  const lights = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, i) => ({
        key: i,
        position: [
          (Math.random() - 0.5) * 10,
          1 + Math.random() * 2,
          (Math.random() - 0.5) * 10,
        ] as const,
        color: Math.random() > 0.5 ? '#3b82f6' : '#10b981',
        intensity: 0.3 + Math.random() * 0.4,
      })),
    []
  );

  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-500 ${
        isDark ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      aria-hidden={!isDark}
    >
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        style={{ pointerEvents: 'none' }}
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        frameloop="demand"
      >
        <FrameLimiter fps={30} />

        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 5, 15]} />

        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />

        {lights.map((l) => (
          <pointLight
            key={l.key}
            position={l.position}
            color={l.color}
            intensity={l.intensity}
            distance={10}
          />
        ))}

        <Suspense fallback={null}>
          <ParkingGrid />
          <Stars radius={100} depth={50} count={5000} factor={4} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-slate-900/60" />
    </div>
  );
}

export default DarkModeBackground;
