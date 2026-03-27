"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Calendar,
    Clock,
    Car,
    Search,
    ChevronLeft,
    CheckCircle2,
    Clock3,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore, useReservationStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { format } from "date-fns"

export default function ManagerReservationsPage() {
    const { t } = useTranslation()
    const { reservations, fetchReservations } = useReservationStore()
    const [searchQuery, setSearchQuery] = React.useState("")

    React.useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    const filteredReservations = React.useMemo(() => {
        return reservations.filter(r => 
            r.parkingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.vehiclePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.spotNumber.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    }, [reservations, searchQuery])

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/dashboard/manager">
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="font-serif text-2xl font-bold sm:text-3xl uppercase tracking-tighter">
                            All Reservations
                        </h1>
                    </div>
                    <p className="text-muted-foreground font-medium">
                        Complete history of all bookings across your facilities.
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search plate, spot or parking..."
                        className="pl-9 glass"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            <div className="rounded-2xl glass overflow-hidden border border-white/10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Parking / Spot</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Vehicle</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Time</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Price</th>
                            <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredReservations.map((booking, index) => (
                            <motion.tr
                                key={booking.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-white/5 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">{booking.parkingName}</span>
                                        <span className="text-xs text-muted-foreground">Spot {booking.spotNumber}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Car className="h-3.5 w-3.5 text-primary" />
                                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                                            {booking.vehiclePlate || "N/A"}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 text-xs font-medium">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {format(booking.startTime, "MMM d, yyyy")}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                            <Clock className="h-3 w-3" />
                                            {format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm font-bold">
                                    €{booking.totalPrice.toFixed(2)}
                                </td>
                                <td className="p-4">
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        booking.status === "active" ? "bg-emerald-500/10 text-emerald-500" :
                                        booking.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                                        "bg-secondary text-muted-foreground"
                                    )}>
                                        {booking.status === "active" ? <CheckCircle2 className="h-3 w-3" /> :
                                         booking.status === "pending" ? <Clock3 className="h-3 w-3" /> :
                                         <AlertCircle className="h-3 w-3" />}
                                        {booking.status}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {filteredReservations.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No reservations found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
