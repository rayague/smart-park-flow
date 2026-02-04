"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function RoutingLoader() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Show loader on change
        setIsLoading(true)

        // Hide after a short delay (simulating page load/compilation wait)
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 800)

        return () => clearTimeout(timer)
    }, [pathname, searchParams])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] pointer-events-none"
                >
                    {/* Top progress bar */}
                    <motion.div
                        className="absolute top-0 left-0 h-1 bg-primary shadow-[0_0_10px_theme(colors.primary.DEFAULT)]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />

                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px]" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
