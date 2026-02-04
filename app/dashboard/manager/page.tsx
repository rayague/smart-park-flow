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
import { useAuthStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

// Mock recent bookings data
const recentBookings = [
    {
        id: "1",
        customer: "Jean Dupont",
        vehicle: "AB-123-CD",
        spot: "A-15",
        startTime: "10:00",
        endTime: "14:00",
        status: "active",
    },
    {
        id: "2",
        customer: "Marie Martin",
        vehicle: "EF-456-GH",
        spot: "B-08",
        startTime: "09:30",
        endTime: "12:30",
        status: "active",
    },
    {
        id: "3",
        customer: "Pierre Durand",
        vehicle: "IJ-789-KL",
        spot: "C-22",
        startTime: "11:00",
        endTime: "15:00",
        status: "pending",
    },
    {
        id: "4",
        customer: "Sophie Leroy",
        vehicle: "MN-012-OP",
        spot: "A-03",
        startTime: "08:00",
        endTime: "18:00",
        status: "active",
    },
]

export default function ManagerDashboard() {
    const { user } = useAuthStore()
    const { t } = useTranslation()

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
            <StatsOverview />

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
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                                                <span className="text-sm font-medium">
                                                    {booking.customer.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-medium">{booking.customer}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Car className="h-4 w-4" />
                                            <span>{booking.vehicle}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="rounded-lg bg-secondary px-2 py-1 text-sm font-medium">
                                            {booking.spot}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>{booking.startTime} - {booking.endTime}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${booking.status === "active"
                                                ? "bg-green-500/10 text-green-500"
                                                : "bg-yellow-500/10 text-yellow-500"
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${booking.status === "active" ? "bg-green-500" : "bg-yellow-500"
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
