"use client"

import * as React from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ParticleData {
    positions: Float32Array
    targetPositions: Float32Array
    initialPositions: Float32Array
    colors: Float32Array
    sizes: Float32Array
}

function ParticleSphere({ count = 2000, isForming = true }: { count?: number; isForming?: boolean }) {
    const pointsRef = React.useRef<THREE.Points>(null!)
    const materialRef = React.useRef<THREE.PointsMaterial>(null!)
    const progressRef = React.useRef(0)

    const particleData = React.useMemo<ParticleData>(() => {
        const positions = new Float32Array(count * 3)
        const targetPositions = new Float32Array(count * 3)
        const initialPositions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        const sphereRadius = 2

        for (let i = 0; i < count; i++) {
            // Initial scattered positions (random in space)
            const scatterRadius = 8 + Math.random() * 4
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos((Math.random() * 2) - 1)

            initialPositions[i * 3] = scatterRadius * Math.sin(phi) * Math.cos(theta)
            initialPositions[i * 3 + 1] = scatterRadius * Math.sin(phi) * Math.sin(theta)
            initialPositions[i * 3 + 2] = scatterRadius * Math.cos(phi)

            // Target positions (on sphere surface)
            const targetTheta = Math.random() * Math.PI * 2
            const targetPhi = Math.acos((Math.random() * 2) - 1)

            targetPositions[i * 3] = sphereRadius * Math.sin(targetPhi) * Math.cos(targetTheta)
            targetPositions[i * 3 + 1] = sphereRadius * Math.sin(targetPhi) * Math.sin(targetTheta)
            targetPositions[i * 3 + 2] = sphereRadius * Math.cos(targetPhi)

            // Start at initial positions
            positions[i * 3] = initialPositions[i * 3]
            positions[i * 3 + 1] = initialPositions[i * 3 + 1]
            positions[i * 3 + 2] = initialPositions[i * 3 + 2]

            // Colors: gradient from blue (#2563eb) to green (#10b981)
            const t = Math.random()
            colors[i * 3] = (37 + t * (16 - 37)) / 255     // R
            colors[i * 3 + 1] = (99 + t * (185 - 99)) / 255 // G
            colors[i * 3 + 2] = (235 + t * (129 - 235)) / 255 // B

            sizes[i] = 0.02 + Math.random() * 0.03
        }

        return { positions, targetPositions, initialPositions, colors, sizes }
    }, [count])

    useFrame((state, delta) => {
        if (!pointsRef.current) return

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
        const time = state.clock.elapsedTime

        if (isForming && progressRef.current < 1) {
            progressRef.current = Math.min(progressRef.current + delta * 0.5, 1)
        }

        const progress = progressRef.current
        const easeProgress = 1 - Math.pow(1 - progress, 3)

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            const baseX = THREE.MathUtils.lerp(particleData.initialPositions[i3], particleData.targetPositions[i3], easeProgress)
            const baseY = THREE.MathUtils.lerp(particleData.initialPositions[i3 + 1], particleData.targetPositions[i3 + 1], easeProgress)
            const baseZ = THREE.MathUtils.lerp(particleData.initialPositions[i3 + 2], particleData.targetPositions[i3 + 2], easeProgress)

            if (easeProgress > 0.9) {
                const waveStrength = (easeProgress - 0.9) * 10 * 0.1
                const offset = Math.sin(time * 2 + i * 0.01) * waveStrength
                positions[i3] = baseX * (1 + offset * 0.1)
                positions[i3 + 1] = baseY * (1 + offset * 0.1)
                positions[i3 + 2] = baseZ * (1 + offset * 0.1)
            } else {
                positions[i3] = baseX
                positions[i3 + 1] = baseY
                positions[i3 + 2] = baseZ
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true
        pointsRef.current.rotation.y = time * 0.3
        pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.1

        if (materialRef.current) {
            materialRef.current.opacity = 0.6 + Math.sin(time * 3) * 0.2
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={particleData.positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={count} array={particleData.colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                ref={materialRef}
                size={0.04}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    )
}

function GlowRings() {
    const ring1Ref = React.useRef<THREE.Mesh>(null!)
    const ring2Ref = React.useRef<THREE.Mesh>(null!)
    const ring3Ref = React.useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        const t = state.clock.elapsedTime
        if (ring1Ref.current) { ring1Ref.current.rotation.x = t * 0.5; ring1Ref.current.rotation.y = t * 0.3 }
        if (ring2Ref.current) { ring2Ref.current.rotation.x = -t * 0.3; ring2Ref.current.rotation.z = t * 0.4 }
        if (ring3Ref.current) { ring3Ref.current.rotation.y = t * 0.6; ring3Ref.current.rotation.z = -t * 0.3 }
    })

    return (
        <group>
            <mesh ref={ring1Ref}>
                <torusGeometry args={[2.5, 0.015, 16, 100]} />
                <meshBasicMaterial color="#2563eb" transparent opacity={0.4} />
            </mesh>
            <mesh ref={ring2Ref}>
                <torusGeometry args={[2.8, 0.012, 16, 100]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
            </mesh>
            <mesh ref={ring3Ref}>
                <torusGeometry args={[3.1, 0.01, 16, 100]} />
                <meshBasicMaterial color="#2563eb" transparent opacity={0.2} />
            </mesh>
        </group>
    )
}

function CoreGlow() {
    const coreRef = React.useRef<THREE.Mesh>(null!)
    useFrame((state) => {
        if (coreRef.current) {
            coreRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
        }
    })
    return (
        <mesh ref={coreRef}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial color="#2563eb" transparent opacity={0.2} />
        </mesh>
    )
}

export default function LoadingScene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.5} color="#2563eb" />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#10b981" />

            <ParticleSphere count={2500} isForming={true} />
            <GlowRings />
            <CoreGlow />
        </>
    )
}
