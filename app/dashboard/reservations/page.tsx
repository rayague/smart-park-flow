"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Car,
    MapPin,
    Clock,
    Calendar,
    MoreVertical,
    QrCode
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useReservationStore } from "@/lib/store"
import { format } from "date-fns"

export default function ReservationsPage() {
    const { t } = useTranslation()

    const { reservations, fetchReservations } = useReservationStore()

    React.useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    const grouped = React.useMemo(() => {
        const active = reservations.filter((r) => r.status === "active")
        const upcoming = reservations.filter((r) => r.status === "pending")
        const past = reservations.filter((r) => r.status === "completed" || r.status === "cancelled")

        return { active, upcoming, past }
    }, [reservations])

    const ReservationCard = ({ booking }: { booking: (typeof reservations)[number] & { viewStatus?: string } }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl glass p-6 card-hover group"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Car className="h-8 w-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg uppercase tracking-tight">{booking.parkingName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.viewStatus === "active" ? "bg-green-500/10 text-green-500" :
                                    booking.viewStatus === "upcoming" ? "bg-blue-500/10 text-blue-500" :
                                        "bg-secondary text-muted-foreground"
                                }`}>
                                {booking.viewStatus === "active" ? t.reservations.status.active : 
                                 booking.viewStatus === "upcoming" ? t.reservations.status.pending : 
                                 t.reservations.status.completed}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {t.booking.summary.spot} {booking.spotNumber}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(booking.startTime, "MMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right mr-4">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.booking.summary.total}</p>
                        <p className="font-bold text-lg">€{booking.totalPrice.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" className="gap-2 font-bold uppercase tracking-tight">
                        <QrCode className="h-4 w-4" />
                        Ticket
                    </Button>
                </div>
            </div>
        </motion.div>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-heading text-3xl font-black tracking-tighter uppercase">{t.reservations.title}</h1>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 bg-subtle p-1 rounded-xl">
                    <TabsTrigger value="active" className="font-bold uppercase text-[10px] tracking-widest">{t.reservations.tabs.active}</TabsTrigger>
                    <TabsTrigger value="upcoming" className="font-bold uppercase text-[10px] tracking-widest">{t.reservations.tabs.upcoming}</TabsTrigger>
                    <TabsTrigger value="past" className="font-bold uppercase text-[10px] tracking-widest">{t.reservations.tabs.past}</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                    {grouped.active.map((booking) => (
                        <ReservationCard key={booking.id} booking={{ ...booking, viewStatus: "active" }} />
                    ))}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
                    {grouped.upcoming.map((booking) => (
                        <ReservationCard key={booking.id} booking={{ ...booking, viewStatus: "upcoming" }} />
                    ))}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    {grouped.past.map((booking) => (
                        <ReservationCard key={booking.id} booking={{ ...booking, viewStatus: booking.status }} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    )
}
