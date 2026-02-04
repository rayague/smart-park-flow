"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TypingTextProps {
  texts: string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function TypingText({
  texts,
  className,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypingTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0)
  const [displayText, setDisplayText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    const currentFullText = texts[currentTextIndex]

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseDuration)
      return () => clearTimeout(pauseTimeout)
    }

    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false)
        setCurrentTextIndex((prev) => (prev + 1) % texts.length)
        return
      }

      const deleteTimeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1))
      }, deletingSpeed)
      return () => clearTimeout(deleteTimeout)
    }

    if (displayText === currentFullText) {
      setIsPaused(true)
      return
    }

    const typeTimeout = setTimeout(() => {
      setDisplayText(currentFullText.slice(0, displayText.length + 1))
    }, typingSpeed)
    return () => clearTimeout(typeTimeout)
  }, [displayText, isDeleting, isPaused, currentTextIndex, texts, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span className="text-gradient-primary">{displayText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className="ml-1 inline-block h-[1em] w-[3px] rounded-full bg-primary glow-primary-sm"
      />
    </span>
  )
}
