"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    CheckCircle2,
    Download,
    Home,
    Calendar,
    MapPin,
    Clock,
    Car,
    Copy,
    Check,
    Sparkles,
    QrCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { useBookingStore, useParkingStore } from "@/lib/store"
import { format } from "date-fns"
import { calculateParkingPrice } from "@/lib/utils/pricing"

function generateICS(title: string, location: string, start: Date, end: Date): string {
    const pad = (d: Date) =>
        d.getFullYear().toString() +
        (d.getMonth() + 1).toString().padStart(2, "0") +
        d.getDate().toString().padStart(2, "0") +
        "T" +
        d.getHours().toString().padStart(2, "0") +
        d.getMinutes().toString().padStart(2, "0") +
        "00"

    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//SmartPark//EN",
        "BEGIN:VEVENT",
        `DTSTART:${pad(start)}`,
        `DTEND:${pad(end)}`,
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        `DESCRIPTION:Parking reservation at ${location}`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n")
}

function QRPattern({ id }: { id: string }) {
    const cells = React.useMemo(() => {
        const grid: boolean[][] = []
        for (let r = 0; r < 9; r++) {
            grid[r] = []
            for (let c = 0; c < 9; c++) {
                const isCorner =
                    (r < 3 && c < 3) ||
                    (r < 3 && c > 5) ||
                    (r > 5 && c < 3)
                if (isCorner) {
                    const ir = r % 3
                    const ic = c % 3
                    grid[r][c] = ir === 1 && ic === 1 ? true : ir === 0 || ir === 2 || ic === 0 || ic === 2
                } else {
                    grid[r][c] = (id.charCodeAt((r * 9 + c) % id.length) + r + c) % 3 !== 0
                }
            }
        }
        return grid
    }, [id])

    return (
        <div className="grid grid-cols-9 grid-rows-9 gap-[3px] p-2">
            {cells.flat().map((filled, i) => (
                <div
                    key={i}
                    className={`w-3 h-3 rounded-[2px] transition-all ${
                        filled ? "bg-foreground" : "bg-transparent"
                    }`}
                />
            ))}
        </div>
    )
}

export function BookingConfirmation() {
    const { t } = useTranslation()
    const router = useRouter()
    const { parkingId, parkingName, selectedDate, startTime, endTime, selectedSpot, isEv } = useBookingStore()
    const { parkings } = useParkingStore()
    const [copied, setCopied] = React.useState(false)

    const parking = parkings.find(p => p.id === parkingId)
    const pricePerHour = parking?.pricePerHour || 5.00

    const pricing = React.useMemo(() => calculateParkingPrice({
        pricePerHour,
        startTime,
        endTime,
        isEv
    }), [pricePerHour, startTime, endTime, isEv])

    const bookingRef = React.useMemo(
        () => `SP-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        []
    )

    const handleCopy = () => {
        navigator.clipboard.writeText(bookingRef)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleAddToCalendar = () => {
        const date = selectedDate || new Date()
        const [sh, sm] = (startTime || "09:00").split(":").map(Number)
        const [eh, em] = (endTime || "18:00").split(":").map(Number)

        const start = new Date(date)
        start.setHours(sh, sm, 0)
        const end = new Date(date)
        end.setHours(eh, em, 0)

        const title = `Parking - ${parkingName || "SmartPark"}`
        const location = `${parkingName || "Parking"} - Spot ${selectedSpot?.number || ""}`

        const ics = generateICS(title, location, start, end)
        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "parking-reservation.ics"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-4"
        >
            {/* Success Header */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                className="relative mb-6"
            >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-yellow-400 flex items-center justify-center shadow-md"
                >
                    <Sparkles className="h-4 w-4 text-yellow-900" />
                </motion.div>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mb-1"
            >
                {t.booking.confirmation.title}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground text-sm mb-8"
            >
                {t.booking.confirmation.message}
            </motion.p>

            {/* Modern Ticket Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="w-full max-w-md"
            >
                <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-gradient-to-b from-card to-card/80 shadow-2xl">
                    {/* Ticket Header */}
                    <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Car className="h-5 w-5" />
                                <span className="font-bold text-sm uppercase tracking-wider">SmartPark</span>
                            </div>
                            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                                E-Ticket
                            </span>
                        </div>
                        <h3 className="text-xl font-bold">{parkingName || "Parking"}</h3>
                        <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>Spot {selectedSpot?.number || "A1"} &bull; Floor {selectedSpot?.floor || 1}</span>
                        </div>
                    </div>

                    {/* Dashed separator with circles */}
                    <div className="relative h-0">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-background" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-6 w-6 rounded-full bg-background" />
                        <div className="border-t-2 border-dashed border-border/30 mx-8" />
                    </div>

                    {/* Ticket Body */}
                    <div className="p-6 space-y-5">
                        {/* Date & Time Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                                    <Calendar className="h-3 w-3" />
                                    Date
                                </div>
                                <p className="font-bold text-lg">
                                    {selectedDate ? format(selectedDate, "MMM dd") : format(new Date(), "MMM dd")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {selectedDate ? format(selectedDate, "yyyy") : format(new Date(), "yyyy")}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                                    <Clock className="h-3 w-3" />
                                    Time
                                </div>
                                <p className="font-bold text-lg">{startTime || "09:00"}</p>
                                <p className="text-xs text-muted-foreground">to {endTime || "18:00"}</p>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <span className="text-sm text-muted-foreground font-medium">Total Paid</span>
                            <span className="text-2xl font-black text-primary">${pricing.total.toFixed(2)}</span>
                        </div>

                        {/* QR Code Section */}
                        <div className="flex flex-col items-center py-2">
                            <div className="rounded-2xl bg-white p-3 shadow-inner">
                                <QRPattern id={bookingRef + (parkingId || "")} />
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">
                                Scan at entrance
                            </p>
                        </div>

                        {/* Booking Reference */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Booking Ref</p>
                                <p className="font-mono font-bold tracking-wider">{bookingRef}</p>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4 text-muted-foreground" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-3 mt-8 w-full max-w-md"
            >
                <Button
                    variant="outline"
                    className="flex-1 gap-2 h-12 rounded-xl"
                    onClick={() => router.push("/dashboard/client")}
                >
                    <Home className="h-4 w-4" />
                    Dashboard
                </Button>
                <Button
                    className="flex-1 gap-2 h-12 rounded-xl bg-gradient-to-r from-primary to-accent"
                    onClick={handleAddToCalendar}
                >
                    <Calendar className="h-4 w-4" />
                    Add to Calendar
                </Button>
            </motion.div>
        </motion.div>
    )
}
