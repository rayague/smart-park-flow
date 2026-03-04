"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { StatsOverview } from "@/components/manager/stats-overview"
import { RevenueChart } from "@/components/manager/revenue-chart"
import { OccupancyHeatmap } from "@/components/manager/occupancy-heatmap"
import { useParkingStore, useReservationStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export default function ProprietaireDashboard() {
    const { t } = useTranslation()
    const { parkings, fetchParkings } = useParkingStore()
    const { reservations, fetchReservations } = useReservationStore()

    React.useEffect(() => {
        fetchParkings()
        fetchReservations()
    }, [fetchParkings, fetchReservations])

    const stats = React.useMemo(() => {
        const activeBookings = reservations.filter(r => r.status === 'active').length
        const totalSpots = parkings.reduce((acc, curr) => acc + curr.totalSpots, 0)
        const availableSpots = parkings.reduce((acc, curr) => acc + curr.availableSpots, 0)
        const occupancy = totalSpots > 0 ? Math.round(((totalSpots - availableSpots) / totalSpots) * 100) : 0
        const evSessions = reservations.filter(r => r.isEv).length

        // Calculate hourly intake across all parkings
        const hourlyIntake = parkings.reduce((acc, p) => {
            const occupied = p.totalSpots - p.availableSpots
            return acc + (occupied * p.pricePerHour)
        }, 0)

        // Revenue defined as sum of all hourly earned as per user request
        const totalRevenue = hourlyIntake

        return {
            revenue: totalRevenue,
            occupancy,
            activeBookings,
            evSessions,
            hourlyIntake
        }
    }, [reservations, parkings])

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
                revenue={stats.revenue}
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
        </div>
    )
}
