"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface BookingStepperProps {
    currentStep: number
    totalSteps: number
}

export function BookingStepper({ currentStep, totalSteps }: BookingStepperProps) {
    const { t } = useTranslation()

    const steps = [
        t.booking.steps.selectSpot,
        t.booking.steps.dateTime,
        t.booking.steps.details,
        t.booking.steps.payment,
        t.booking.steps.confirm,
    ]

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                {steps.slice(0, totalSteps).map((step, index) => {
                    const stepNumber = index + 1
                    const isCompleted = stepNumber < currentStep
                    const isCurrent = stepNumber === currentStep

                    return (
                        <React.Fragment key={step}>
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className={cn(
                                        "relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                                        isCompleted
                                            ? "border-accent bg-accent text-white"
                                            : isCurrent
                                                ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                                                : "border-border bg-secondary text-muted-foreground"
                                    )}
                                >
                                    <AnimatePresence mode="wait">
                                        {isCompleted ? (
                                            <motion.div
                                                key="check"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            >
                                                <Check className="h-6 w-6" />
                                            </motion.div>
                                        ) : (
                                            <motion.span
                                                key="number"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="text-sm font-semibold"
                                            >
                                                {stepNumber}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Pulse effect for current step */}
                                    {isCurrent && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-primary"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.5, 0, 0.5],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        />
                                    )}
                                </motion.div>

                                {/* Step Label */}
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={cn(
                                        "mt-2 text-xs font-medium transition-colors",
                                        isCurrent ? "text-primary" : "text-muted-foreground"
                                    )}
                                >
                                    {step}
                                </motion.span>
                            </div>

                            {/* Connector Line */}
                            {index < totalSteps - 1 && (
                                <div className="relative flex-1 mx-2 h-0.5 bg-border">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                                        }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}
