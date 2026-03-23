"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Car,
    MapPin,
    Calendar,
    Clock,
    CreditCard,
    Zap,
    Info
} from "lucide-react"
import { useBookingStore, useParkingStore } from "@/lib/store"
import { format } from "date-fns"
import { useTranslation } from "@/lib/i18n"
import { calculateParkingPrice } from "@/lib/utils/pricing"
import { Button } from "@/components/ui/button"

export function BookingSummary() {
    const { t } = useTranslation()
    const {
        parkingId,
        parkingName,
        selectedSpot,
        selectedDate,
        startTime,
        endTime,
        isEv,
    } = useBookingStore()

    const { parkings } = useParkingStore()

    const parking = parkings.find(p => p.id === parkingId)
    const pricePerHour = parking?.pricePerHour || 5.00

    const pricing = React.useMemo(() => calculateParkingPrice({
        pricePerHour,
        startTime,
        endTime,
        isEv
    }), [pricePerHour, startTime, endTime, isEv])

    const { subtotal, serviceFee, evFee, total, durationInHours: duration } = pricing

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h2 className="font-serif text-2xl font-bold mb-2">
                    {t.booking.summary.title}
                </h2>
                <p className="text-muted-foreground">
                    Review your booking details before confirming
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Details Card */}
                <div className="space-y-4">
                    <div className="rounded-2xl glass p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Info className="h-4 w-4 text-primary" />
                            Booking Details
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-muted-foreground">{t.booking.summary.spot}</span>
                                <span className="font-medium flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    {selectedSpot?.number} (Floor {selectedSpot?.floor})
                                </span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-muted-foreground">{t.booking.summary.date}</span>
                                <span className="font-medium">
                                    {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "-"}
                                </span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-muted-foreground">{t.booking.summary.time}</span>
                                <span className="font-medium">{startTime} - {endTime}</span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-muted-foreground">{t.booking.summary.duration}</span>
                                <span className="font-medium">{duration.toFixed(1)} {t.booking.dateTime.hours}</span>
                            </div>

                            {isEv && (
                                <div className="flex justify-between py-2 text-accent">
                                    <span className="flex items-center gap-1">
                                        <Zap className="h-3 w-3" />
                                        EV Charging
                                    </span>
                                    <span className="font-medium">Included</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="space-y-4">
                    <div className="rounded-2xl glass p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                            Payment Summary
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t.booking.summary.subtotal}</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t.booking.summary.serviceFee}</span>
                                <span>${serviceFee.toFixed(2)}</span>
                            </div>

                            {isEv && (
                                <div className="flex justify-between text-sm text-accent">
                                    <span>EV Charging Fee</span>
                                    <span>${evFee.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="pt-4 mt-2 border-t border-border flex justify-between items-center">
                                <span className="font-bold text-lg">{t.booking.summary.total}</span>
                                <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <p className="text-xs text-center text-muted-foreground mt-2">
                            Click "Next" to proceed to payment
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
