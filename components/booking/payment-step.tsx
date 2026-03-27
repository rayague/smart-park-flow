"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    CreditCard,
    Lock,
    ShieldCheck,
    Loader2,
    AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBookingStore, useReservationStore, useParkingStore, useAuthStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/lib/i18n"
import { calculateParkingPrice } from "@/lib/utils/pricing"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function PaymentStep() {
    const { t } = useTranslation()
    const { toast } = useToast()
    const {
        parkingId,
        parkingName,
        selectedSpot,
        selectedDate,
        startTime,
        endTime,
        isEv,
        vehiclePlate,
        nextStep
    } = useBookingStore()

    const { fetchReservations, addReservation } = useReservationStore()
    const { parkings } = useParkingStore()
    const { user } = useAuthStore()

    const parking = parkings.find(p => p.id === parkingId)
    const pricePerHour = parking?.pricePerHour || 5.00

    const pricing = React.useMemo(() => calculateParkingPrice({
        pricePerHour,
        startTime,
        endTime,
        isEv
    }), [pricePerHour, startTime, endTime, isEv])

    const [cardNumber, setCardNumber] = React.useState("")
    const [cardName, setCardName] = React.useState("")
    const [expiry, setExpiry] = React.useState("")
    const [cvc, setCvc] = React.useState("")
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [paymentMethod, setPaymentMethod] = React.useState<"card" | "paypal">("card")
    const [error, setError] = React.useState("")

    const formatCardNumber = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 16)
        return digits.replace(/(.{4})/g, "$1 ").trim()
    }

    const formatExpiry = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 4)
        if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
        return digits
    }

    const isFormValid = paymentMethod === "paypal" || (
        cardNumber.replace(/\s/g, "").length >= 4 &&
        cardName.trim().length > 0 &&
        expiry.length >= 3 &&
        cvc.length >= 3
    )

    const handlePay = async () => {
        setError("")

        if (!user) {
            setError("You must be logged in to complete the payment.")
            toast({ title: "Error", description: "You must be logged in.", variant: "destructive" })
            return
        }

        if (!isFormValid) {
            setError("Please fill in all payment fields.")
            return
        }

        setIsProcessing(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1500))

            const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
            const startStr = `${dateStr}T${startTime}:00`
            const endStr = `${dateStr}T${endTime}:00`

            const reservationData = {
                user_id: user.id,
                parking_id: parkingId!,
                spot_id: selectedSpot?.id ?? parkingId!,
                parking_name: parkingName || "Parking",
                spot_number: selectedSpot?.number || "A1",
                start_time: startStr,
                end_time: endStr,
                total_price: pricing.total,
                vehicle_plate: vehiclePlate || "NOT-SET",
                is_ev: isEv,
                status: 'PAID' as Database['public']['Enums']['reservation_status'],
            }

            const { data, error: insertError } = await supabase
                .from('reservations')
                .insert(reservationData)
                .select()

            if (insertError) {
                console.error("Supabase insert error:", insertError)
                throw new Error("Failed to create reservation in database.")
            }

            const localReservation = {
                id: data?.[0]?.id || crypto.randomUUID(),
                parkingId: parkingId!,
                parkingName: parkingName || "Parking",
                spotId: selectedSpot?.id ?? parkingId!,
                spotNumber: selectedSpot?.number || "A1",
                userId: user.id,
                startTime: new Date(startStr),
                endTime: new Date(endStr),
                status: "pending" as const,
                totalPrice: pricing.total,
                vehiclePlate: vehiclePlate || "NOT-SET",
                isEv: isEv,
            }

            addReservation(localReservation)

            try {
                await fetchReservations()
            } catch (_) {
                // Local store already has the reservation
            }

            toast({
                title: "Payment successful!",
                description: `Your reservation at ${parkingName} has been confirmed.`,
            })

            nextStep()
        } catch (err: any) {
            console.error("Payment error:", err)
            setError(err.message || "Payment failed. Please try again.")
            toast({
                title: "Error",
                description: err.message || "Payment failed. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h2 className="font-serif text-2xl font-bold mb-2">{t.booking.summary.title || "Payment"}</h2>
                <p className="text-muted-foreground">
                    {t.booking.payment?.enterDetails || "Enter your payment details to complete the booking"}
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Payment Form */}
                <div className="space-y-6">
                    <div className="flex flex-col gap-3">
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-500">
                                {t.booking?.payment?.notImplemented || "Payment gateway integration is currently in demo mode. Selecting a method will simulate a successful transaction."}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("card")}
                                className={cn(
                                    "flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                                    paymentMethod === "card"
                                        ? "border-primary bg-primary/5"
                                        : "border-border/50 hover:border-border"
                                )}
                            >
                                <CreditCard className={cn("h-5 w-5", paymentMethod === "card" ? "text-primary" : "text-muted-foreground")} />
                                <span className="font-medium text-sm">Credit Card</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("paypal")}
                                className={cn(
                                    "flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                                    paymentMethod === "paypal"
                                        ? "border-primary bg-primary/5"
                                        : "border-border/50 hover:border-border"
                                )}
                            >
                                <span className={cn("font-bold text-sm", paymentMethod === "paypal" ? "text-primary" : "text-muted-foreground")}>PP</span>
                                <span className="font-medium text-sm">PayPal</span>
                            </button>
                        </div>
                    </div>

                    {paymentMethod === "card" ? (
                        <div className="rounded-2xl glass p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        className="pl-10"
                                        maxLength={19}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cardholder Name</label>
                                <Input
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Expiry Date</label>
                                    <Input
                                        value={expiry}
                                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">CVC</label>
                                    <Input
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                        placeholder="123"
                                        maxLength={4}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl glass p-8 text-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-blue-500/10 mx-auto flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-500">PP</span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                You will be redirected to PayPal to complete the payment securely.
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        <span>Your payment information is encrypted and secure</span>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                    <div className="rounded-2xl glass p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                            Order Summary
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-muted-foreground">Parking</span>
                                <span className="font-medium">{parkingName}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-muted-foreground">Spot</span>
                                <span className="font-medium">{selectedSpot?.number} (Floor {selectedSpot?.floor})</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-muted-foreground">Date</span>
                                <span className="font-medium">{selectedDate ? format(selectedDate, "MMM dd, yyyy") : "-"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-muted-foreground">Time</span>
                                <span className="font-medium">{startTime} - {endTime}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${pricing.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border/50">
                                <span className="text-muted-foreground">Service Fee</span>
                                <span>${pricing.serviceFee.toFixed(2)}</span>
                            </div>
                            {isEv && (
                                <div className="flex justify-between py-2 border-b border-border/50 text-accent">
                                    <span>EV Charging</span>
                                    <span>${pricing.evFee.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 mt-2 border-t border-border flex justify-between items-center">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-2xl text-primary">${pricing.total.toFixed(2)}</span>
                        </div>

                        <Button
                            type="button"
                            className="w-full h-12 text-lg font-medium glow-primary mt-4"
                            onClick={handlePay}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                `Pay $${pricing.total.toFixed(2)}`
                            )}
                        </Button>

                        {!isFormValid && paymentMethod === "card" && (
                            <p className="text-xs text-center text-orange-400 mt-1">
                                Please fill in all card fields to proceed
                            </p>
                        )}

                        <p className="text-xs text-center text-muted-foreground mt-2">
                            By confirming, you agree to our Terms of Service
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
