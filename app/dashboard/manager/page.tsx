"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Calendar,
    Clock,
    Car,
    MoreHorizontal,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsOverview } from "@/components/manager/stats-overview"
import { RevenueChart } from "@/components/manager/revenue-chart"
import { OccupancyHeatmap } from "@/components/manager/occupancy-heatmap"
import { useAuthStore, useParkingStore, useReservationStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export default function ManagerDashboard() {
    const { user } = useAuthStore()
    const { t } = useTranslation()

    const { parkings, fetchParkings } = useParkingStore()
    const { reservations, fetchReservations } = useReservationStore()

    React.useEffect(() => {
        fetchParkings()
        fetchReservations()
    }, [fetchParkings, fetchReservations])

    const recentBookings = React.useMemo(() => reservations.slice(0, 5), [reservations])

    const stats = React.useMemo(() => {
        const activeBookings = reservations.filter((r) => r.status === "active").length
        const totalSpots = parkings.reduce((acc, curr) => acc + curr.totalSpots, 0)
        const availableSpots = parkings.reduce((acc, curr) => acc + curr.availableSpots, 0)
        const occupancy = totalSpots > 0 ? Math.round(((totalSpots - availableSpots) / totalSpots) * 100) : 0
        const evSessions = reservations.filter((r) => r.isEv).length

        // Calculate hourly intake across all parkings
        const hourlyIntake = parkings.reduce((acc, p) => {
            const occupied = p.totalSpots - p.availableSpots
            return acc + (occupied * p.pricePerHour)
        }, 0)

        // Revenue defined as sum of all hourly earned as per user request
        const totalRevenue = hourlyIntake

        return { totalRevenue, occupancy, activeBookings, evSessions, hourlyIntake }
    }, [parkings, reservations])

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-1"
            >
                <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                    {t.managerDashboard.title}
                </h1>
                <p className="text-muted-foreground">
                    {t.managerDashboard.subtitle}
                </p>
            </motion.div>

            {/* Stats Overview */}
            <StatsOverview
                revenue={stats.totalRevenue}
                occupancy={stats.occupancy}
                activeBookings={stats.activeBookings}
                evSessions={stats.evSessions}
                hourlyIntake={stats.hourlyIntake}
            />

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                <RevenueChart />
                <OccupancyHeatmap />
            </div>

            {/* Recent Bookings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl glass p-6"
            >
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-serif text-xl font-semibold">
                        {t.managerDashboard.sections.recentBookings}
                    </h3>
                    <Button variant="ghost" size="sm" className="gap-1">
                        {t.common.viewAll}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Vehicle</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Spot</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Time</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {recentBookings.map((booking, index) => (
                                <motion.tr
                                    key={booking.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="group"
                                >
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-icon-box">
                                                <span className="text-sm font-medium">
                                                    {(booking.parkingName || "R").charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-medium">{booking.parkingName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Car className="h-4 w-4" />
                                            <span>{booking.vehiclePlate || "-"}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="rounded-lg bg-icon-box px-2 py-1 text-sm font-medium">
                                            {booking.spotNumber}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {booking.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                                                {booking.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${booking.status === "active"
                                            ? "bg-green-500/10 text-green-500"
                                            : booking.status === "pending"
                                                ? "bg-yellow-500/10 text-yellow-500"
                                                : "bg-secondary text-muted-foreground"
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${booking.status === "active"
                                                ? "bg-green-500"
                                                : booking.status === "pending"
                                                    ? "bg-yellow-500"
                                                    : "bg-muted-foreground"
                                                }`} />
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
