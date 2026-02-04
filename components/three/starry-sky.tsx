"use client"

import * as React from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import { useTheme } from "next-themes"

function Stars(props: any) {
    const ref = React.useRef<any>()

    // Use useMemo to generate points only once
    const sphere = React.useMemo(() => {
        const count = 5000
        const positions = new Float32Array(count * 3)

        for (let i = 0; i < count; i++) {
            // Random point in sphere logic
            // Using cosine distribution for uniform spherical distribution
            const r = 1.5 * Math.cbrt(Math.random()) // cbrt for uniform volume distribution
            const theta = Math.random() * 2 * Math.PI
            const phi = Math.acos(2 * Math.random() - 1)

            const x = r * Math.sin(phi) * Math.cos(theta)
            const y = r * Math.sin(phi) * Math.sin(theta)
            const z = r * Math.cos(phi)

            // Ensure no NaNs are generated
            positions[i * 3] = isNaN(x) ? 0 : x
            positions[i * 3 + 1] = isNaN(y) ? 0 : y
            positions[i * 3 + 2] = isNaN(z) ? 0 : z
        }

        return positions
    }, [])

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10
            ref.current.rotation.y -= delta / 15
        }
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

export function StarrySky() {
    const { theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Only render if mounted and in dark mode
    if (!mounted || theme !== "dark") return null

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 1] }}
                gl={{ alpha: true, antialias: false }} // Performance optimizations
            >
                <Stars />
            </Canvas>
        </div>
    )
}
