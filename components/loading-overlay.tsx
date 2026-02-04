"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { useI18nStore } from "@/lib/i18n"
import { useTheme } from "next-themes"

// Dynamic import for Three.js component to avoid SSR issues and improve initial load
const LoadingSphere = dynamic(
    () => import("@/components/three/loading-sphere").then((mod) => mod.LoadingSphere),
    { ssr: false }
)

interface LoadingOverlayProps {
    isLoading?: boolean
    minDuration?: number
}

export function LoadingOverlay({
    isLoading: externalLoading,
    minDuration = 3000
}: LoadingOverlayProps) {
    const [isVisible, setIsVisible] = React.useState(true)
    const [hasMinDurationPassed, setHasMinDurationPassed] = React.useState(false)
    const { isChangingLanguage } = useI18nStore()
    const { theme } = useTheme()
    const prevTheme = React.useRef(theme)
    const [isChangingTheme, setIsChangingTheme] = React.useState(false)

    // Helper to start the minimum duration timer
    const startMinDurationTimer = React.useCallback(() => {
        setHasMinDurationPassed(false)
        const timer = setTimeout(() => {
            setHasMinDurationPassed(true)
        }, minDuration)
        return timer
    }, [minDuration])

    // Handle initial page load
    React.useEffect(() => {
        const timer = startMinDurationTimer()
        return () => clearTimeout(timer)
    }, [startMinDurationTimer])

    // Handle theme changes
    React.useEffect(() => {
        if (prevTheme.current !== undefined && prevTheme.current !== theme) {
            setIsChangingTheme(true)
            setIsVisible(true)
            const timer = startMinDurationTimer()

            // Allow theme change state to reset after duration
            const resetThemeStateTimer = setTimeout(() => {
                setIsChangingTheme(false)
            }, minDuration)

            return () => {
                clearTimeout(timer)
                clearTimeout(resetThemeStateTimer)
            }
        }
        prevTheme.current = theme
    }, [theme, startMinDurationTimer, minDuration])

    // Handle visibility logic
    React.useEffect(() => {
        const shouldBeVisible =
            !hasMinDurationPassed ||
            externalLoading ||
            isChangingLanguage ||
            isChangingTheme

        if (!shouldBeVisible) {
            const hideTimer = setTimeout(() => {
                setIsVisible(false)
            }, 500) // Smooth fade out delay
            return () => clearTimeout(hideTimer)
        } else {
            setIsVisible(true)
        }
    }, [hasMinDurationPassed, externalLoading, isChangingLanguage, isChangingTheme])

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    key="loading-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
                >
                    {/* Background effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                    </div>

                    {/* Loading Sphere - Full Screen Container */}
                    <div className="absolute inset-0 z-0">
                        <LoadingSphere className="w-full h-full" />
                    </div>

                    {/* Brand text & Indicator */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative z-10 mt-auto mb-24 text-center"
                    >
                        <h1 className="font-serif text-4xl font-bold tracking-tight mb-4">
                            Smart<span className="text-primary">Park</span>
                        </h1>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
                                {isChangingLanguage ? "Changing Language" : isChangingTheme ? "Updating Theme" : "Initialize"}
                            </span>
                            <LoadingDots />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function LoadingDots() {
    return (
        <div className="flex gap-1.5 h-1.5 item-center">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}
