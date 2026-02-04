"use client"

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Lazy load Canvas
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => mod.Canvas), {
    ssr: false,
    loading: () => null
})

// Lazy load Scene
const LoadingScene = dynamic(() => import('./loading-scene'), {
    ssr: false
})

export function LoadingSphere({ className }: { className?: string }) {
    return (
        <div
            className={className}
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                pointerEvents: 'none'
            }}
        >
            <Suspense fallback={null}>
                <Canvas
                    camera={{ position: [0, 0, 6], fov: 60 }}
                    dpr={[1, 2]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: "high-performance",
                    }}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <LoadingScene />
                </Canvas>
            </Suspense>
        </div>
    )
}
