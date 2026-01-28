'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useAppStore } from '@/store/useAppStore';

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function StarSphereMorph({ progress01 }: { progress01: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array | null>(null);
  const startPositions = useRef<Float32Array | null>(null);
  const targetPositions = useRef<Float32Array | null>(null);

  const count = 2200;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const start = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);

    // Start: loose nebula-ish cloud
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      start[i3 + 0] = (Math.random() - 0.5) * 8;
      start[i3 + 1] = (Math.random() - 0.5) * 5;
      start[i3 + 2] = (Math.random() - 0.5) * 8;

      // Target: sphere surface with slight thickness
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.2 + Math.random() * 0.35;
      target[i3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      target[i3 + 1] = r * Math.cos(phi);
      target[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    const current = new Float32Array(start);
    g.setAttribute('position', new THREE.BufferAttribute(current, 3));

    positions.current = current;
    startPositions.current = start;
    targetPositions.current = target;

    return g;
  }, []);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const pos = positions.current;
    const start = startPositions.current;
    const target = targetPositions.current;
    if (!pos || !start || !target) return;

    const t = easeInOutCubic(THREE.MathUtils.clamp(progress01, 0, 1));
    const wobble = (1 - t) * 0.25;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const sx = start[i3 + 0];
      const sy = start[i3 + 1];
      const sz = start[i3 + 2];
      const tx = target[i3 + 0];
      const ty = target[i3 + 1];
      const tz = target[i3 + 2];

      pos[i3 + 0] = THREE.MathUtils.lerp(sx, tx, t) + Math.sin(time * 1.2 + i * 0.02) * wobble;
      pos[i3 + 1] = THREE.MathUtils.lerp(sy, ty, t) + Math.cos(time * 1.1 + i * 0.015) * wobble;
      pos[i3 + 2] = THREE.MathUtils.lerp(sz, tz, t) + Math.sin(time * 1.0 + i * 0.017) * wobble;
    }

    const attr = geometry.getAttribute('position') as THREE.BufferAttribute;
    attr.needsUpdate = true;

    pts.rotation.y = time * 0.35;
    pts.rotation.x = Math.sin(time * 0.25) * 0.12;
    pts.position.y = Math.sin(time * 0.6) * 0.08;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.022}
        color={new THREE.Color('#93c5fd')}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function InitialLoader() {
  const loaderNonce = useAppStore((s) => s.loaderNonce);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const hasShownOnceRef = useRef(false);

  const beginExit = () => {
    setIsExiting(true);
    window.setTimeout(() => setVisible(false), 450);
  };

  useEffect(() => {
    // Replay on mount + on theme/language changes (loaderNonce increments)
    setIsExiting(false);
    setVisible(true);
    setProgress(0);

    const isReplay = hasShownOnceRef.current;
    hasShownOnceRef.current = true;

    const animMs = isReplay ? 1800 : 2800;
    const minVisibleMs = isReplay ? 2000 : 3000;

    const start = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(100, (elapsed / animMs) * 100);
      setProgress(Math.round(p));
      if (p < 100) raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);

    const doneTimer = window.setTimeout(() => {
      setProgress(100);
    }, animMs);

    const exitTimer = window.setTimeout(() => {
      beginExit();
    }, minVisibleMs);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [loaderNonce]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-slate-950 text-white transition-all duration-500 ${
        isExiting ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
      }`}
    >
      <div className="absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-[520px] w-[520px] rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />
      </div>

      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 1.6, 4.2], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#020617']} />
          <fog attach="fog" args={['#020617', 3, 10]} />
          <ambientLight intensity={0.25} />
          <spotLight position={[6, 8, 6]} intensity={1.4} angle={0.35} penumbra={0.6} color="#60a5fa" />
          <pointLight position={[-6, 2, -2]} intensity={0.8} color="#34d399" />
          <Suspense fallback={null}>
            <StarSphereMorph progress01={progress / 100} />
            <Sparkles count={120} speed={0.4} opacity={0.12} size={1.5} scale={[14, 8, 14]} />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate autoRotateSpeed={1.2} />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute top-10 left-10">
        <div className="text-lg font-semibold tracking-wide">SmartPark</div>
        <div className="text-xs text-white/60">Parking intelligent</div>
      </div>

      <div className="absolute inset-x-0 bottom-10 px-6">
        <div className="mx-auto max-w-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-white/70">Chargement…</div>
            <div className="text-sm tabular-nums text-white/70">{progress}%</div>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitialLoader;
