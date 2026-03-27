"use client"

import * as React from "react"
import Link from "next/link"
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
import { cn } from "@/lib/utils"

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
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        const activeBookings = reservations.filter((r) => r.status === "active").length
        const totalSpots = parkings.reduce((acc, curr) => acc + curr.totalSpots, 0)
        const availableSpots = parkings.reduce((acc, curr) => acc + curr.availableSpots, 0)
        const occupancy = totalSpots > 0 ? Math.round(((totalSpots - availableSpots) / totalSpots) * 100) : 0
        const evSessions = reservations.filter((r) => r.isEv).length

        // Calculate hourly intake
        const hourlyIntake = parkings.reduce((acc, p) => {
            const occupied = p.totalSpots - p.availableSpots
            return acc + (occupied * p.pricePerHour)
        }, 0)

        // Real historical revenue
        const lifetimeRevenue = reservations
            .filter(r => r.status === 'active' || r.status === 'completed')
            .reduce((acc, r) => acc + (r.totalPrice || 0), 0)

        // Calculate changes (crude but dynamic)
        const recentReservations = reservations.filter(r => r.startTime >= thirtyDaysAgo)
        const olderReservations = reservations.filter(r => r.startTime < thirtyDaysAgo)
        
        const calculateChange = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0
            return Math.round(((current - previous) / previous) * 100 * 10) / 10
        }

        const revChange = calculateChange(
            recentReservations.reduce((acc, r) => acc + (r.totalPrice || 0), 0),
            olderReservations.length > 0 ? olderReservations.reduce((acc, r) => acc + (r.totalPrice || 0), 0) / (olderReservations.length / (recentReservations.length || 1)) : 0
        )

        return { 
            totalRevenue: lifetimeRevenue, 
            occupancy, 
            activeBookings, 
            evSessions, 
            hourlyIntake,
            revChange: calculateChange(recentReservations.length, Math.max(1, olderReservations.length / 2)), // simplified growth
            bookChange: calculateChange(activeBookings, Math.max(1, reservations.length - activeBookings))
        }
    }, [parkings, reservations])

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-1"
            >
                <h1 className="font-heading text-2xl font-black sm:text-3xl uppercase tracking-tighter">
                    {t.managerDashboard.title}
                </h1>
                <p className="text-muted-foreground font-medium">
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
                revChange={stats.revChange}
                bookChange={stats.bookChange}
            />

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2 overflow-hidden">
                <RevenueChart reservations={reservations} />
                <OccupancyHeatmap reservations={reservations} />
            </div>

            {/* Recent Bookings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl glass p-4 sm:p-6"
            >
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-heading text-xl font-black uppercase tracking-tighter">
                        {t.managerDashboard.sections.recentBookings}
                    </h3>
                    <Link href="/dashboard/manager/reservations">
                        <Button variant="ghost" size="sm" className="gap-1 font-black uppercase tracking-tighter text-[10px]">
                            {t.common.viewAll}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="pb-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                                    <th className="pb-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden sm:table-cell">Vehicle</th>
                                    <th className="pb-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Spot</th>
                                    <th className="pb-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">Time</th>
                                    <th className="pb-3 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                    <th className="pb-3 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
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
                                        <td className="py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <span className="text-[10px] font-black uppercase">
                                                        {(booking.parkingName || "R").charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-sm">{booking.parkingName}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 hidden sm:table-cell whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Car className="h-3.5 w-3.5" />
                                                <span className="text-xs font-medium uppercase">{booking.vehiclePlate || "-"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 whitespace-nowrap">
                                            <span className="rounded-lg bg-secondary/50 px-2 py-1 text-[10px] font-black uppercase tracking-tighter">
                                                {booking.spotNumber}
                                            </span>
                                        </td>
                                        <td className="py-4 hidden md:table-cell whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>
                                                    {booking.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 whitespace-nowrap">
                                            <span className={cn(
                                                "rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                                                booking.status === "active" ? "bg-emerald-500/10 text-emerald-500" :
                                                booking.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                                                "bg-secondary text-muted-foreground"
                                            )}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
