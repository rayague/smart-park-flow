"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingStepper } from "@/components/booking/booking-stepper"
import { SpotSelector } from "@/components/booking/spot-selector"
import { BookingDateTimePicker } from "@/components/booking/date-time-picker"
import { BookingSummary } from "@/components/booking/booking-summary"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"
import { useTranslation } from "@/lib/i18n"
import { useBookingStore, useParkingStore, Parking } from "@/lib/store"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function BookingPage({ params }: { params: { parkingId: string } }) {
    const { t } = useTranslation()
    const {
        step,
        setStep,
        nextStep,
        prevStep,
        selectedSpot,
        startTime,
        endTime,
        setParking
    } = useBookingStore()
    const { parkings } = useParkingStore()

    // Initialize parking info
    React.useEffect(() => {
        const parking = parkings.find(p => p.id === params.parkingId)
        if (parking) {
            setParking(parking.id, parking.name)
        }
        setStep(1)
    }, [params.parkingId, parkings, setParking, setStep])

    const totalSteps = 4

    const canProceed = React.useMemo(() => {
        switch (step) {
            case 1:
                return !!selectedSpot
            case 2:
                return !!startTime && !!endTime
            case 3:
                return true
            default:
                return false
        }
    }, [step, selectedSpot, startTime, endTime])

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-24">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Progress */}
                    <BookingStepper currentStep={step} totalSteps={totalSteps} />

                    {/* Content Area */}
                    <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <SpotSelector />
                                </motion.div>
                            )}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <BookingDateTimePicker />
                                </motion.div>
                            )}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <BookingSummary />
                                </motion.div>
                            )}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <BookingConfirmation />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    {step < 4 && (
                        <motion.div
                            className="flex justify-between pt-8 border-t border-border/50"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={step === 1}
                                className="gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                {t.common.back}
                            </Button>

                            <Button
                                onClick={nextStep}
                                disabled={!canProceed}
                                className="gap-2 bg-gradient-to-r from-primary to-accent glow-primary"
                            >
                                {step === 3 ? t.booking.summary.confirmBooking : t.common.next}
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
