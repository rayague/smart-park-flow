"use client"

import * as React from "react"
import { useTheme } from "next-themes"

// Configuration des couleurs d'étoiles
const starColors = [
  "#ffffff",  // Blanc
  "#ffe4e1",  // Rose pâle
  "#e6f3ff",  // Bleu clair
  "#fffacd",  // Jaune pâle
  "#f0e6ff",  // Violet pâle
]

// Générer 60 étoiles avec mouvement
const generateStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    color: starColors[Math.floor(Math.random() * starColors.length)],
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
    moveX: (Math.random() - 0.5) * 20, // Mouvement horizontal
    moveY: (Math.random() - 0.5) * 20, // Mouvement vertical
  }))
}

const stars = generateStars(60)

export function CssStars() {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || theme !== "dark") return null

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-star-float"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: Math.random() * 0.5 + 0.4,
            '--move-x': `${star.moveX}px`,
            '--move-y': `${star.moveY}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
