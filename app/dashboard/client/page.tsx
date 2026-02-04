"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Car,
    MapPin,
    Clock,
    Calendar,
    CreditCard,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { useAuthStore, useReservationStore } from "@/lib/store"
import Link from "next/link"
import { format } from "date-fns"

export default function ClientDashboard() {
    const { user } = useAuthStore()
    const { t } = useTranslation()
    const { reservations, fetchReservations } = useReservationStore()

    React.useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    // Get 3 most recent reservations
    const upcomingReservations = reservations
        .filter(r => r.status === 'active' || r.status === 'pending')
        .slice(0, 3)

    const stats = React.useMemo(() => {
        const totalBookings = reservations.length
        const totalHours = reservations.reduce((acc, r) => {
            const start = new Date(r.startTime).getTime()
            const end = new Date(r.endTime).getTime()
            return acc + (end - start) / (1000 * 60 * 60)
        }, 0)
        const amountSpent = reservations.reduce((acc, r) => acc + r.totalPrice, 0)

        return [
            { label: "Total Bookings", value: totalBookings.toString(), icon: Calendar, color: "bg-blue-500/10 text-blue-500" },
            { label: "Hours Parked", value: `${Math.round(totalHours)}h`, icon: Clock, color: "bg-orange-500/10 text-orange-500" },
            { label: "Amount Spent", value: `€${amountSpent.toFixed(2)}`, icon: CreditCard, color: "bg-green-500/10 text-green-500" },
        ]
    }, [reservations])

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 text-white"
            >
                <div className="relative z-10">
                    <h1 className="font-serif text-3xl font-bold mb-2">
                        {t.userDashboard.welcome}, {user?.name || "Client"}!
                    </h1>
                    <p className="opacity-90 max-w-xl">
                        {t.userDashboard.subtitle}
                    </p>
                    <div className="mt-6 flex gap-4">
                        <Link href="/discover">
                            <Button size="lg" variant="secondary" className="gap-2">
                                <MapPin className="h-4 w-4" />
                                Find Parking
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 right-20 -mb-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-3">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="rounded-2xl glass p-6 card-hover"
                    >
                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="text-2xl font-bold mb-1">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Upcoming Reservations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl glass p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif text-xl font-semibold">
                            {t.userDashboard.navigation.reservations}
                        </h3>
                        <Link href="/dashboard/client/reservations">
                            <Button variant="ghost" size="sm" className="gap-1">
                                View All <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {upcomingReservations.length > 0 ? (
                            upcomingReservations.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Car className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{booking.parkingName}</h4>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                Spot {booking.spotNumber}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-sm">{format(booking.startTime, "MMM d, HH:mm")}</div>
                                        <div className="text-sm text-muted-foreground">{format(booking.endTime, "HH:mm")}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">
                                No upcoming reservations
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Quick Actions or Promo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl glass p-6 flex flex-col justify-center items-center text-center space-y-4"
                >
                    <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                        <Car className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="font-serif text-xl font-bold">Add Your Vehicle</h3>
                    <p className="text-muted-foreground max-w-xs">
                        Register your vehicle to enable automatic license plate recognition and faster entry.
                    </p>
                    <Button className="mt-4">
                        Register Vehicle
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}
