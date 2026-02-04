"use client"

import dynamic from "next/dynamic"

const StarrySkyComponent = dynamic(
    () => import("@/components/three/starry-sky").then((mod) => mod.StarrySky),
    { ssr: false }
)

export function StarrySkyWrapper() {
    return <StarrySkyComponent />
}
