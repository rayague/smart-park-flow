"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Car } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-xl glow-primary"
            >
                <Car className="h-10 w-10 text-white" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center"
            >
                <h2 className="font-serif text-2xl font-bold">
                    Smart<span className="text-primary">Park</span>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground animate-pulse">
                    Charing experience...
                </p>
            </motion.div>

            {/* Loading bar */}
            <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-secondary">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>
        </div>
    )
}
