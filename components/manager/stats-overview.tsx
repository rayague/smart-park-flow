"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    Car,
    Zap
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Stat {
    title: string
    value: string | number
    change: number
    changeLabel: string
    icon: React.ElementType
    gradient: string
}

interface StatsOverviewProps {
    revenue?: number;
    occupancy?: number;
    activeBookings?: number;
    evSessions?: number;
}

export function StatsOverview({
    revenue = 12845,
    occupancy = 78,
    activeBookings = 156,
    evSessions = 48
}: StatsOverviewProps) {
    const { t } = useTranslation()

    const stats: Stat[] = [
        {
            title: t.managerDashboard.stats.totalRevenue,
            value: `€${revenue.toLocaleString()}`,
            change: 12.5,
            changeLabel: t.managerDashboard.stats.vsLastMonth,
            icon: DollarSign,
            gradient: "from-primary to-blue-400",
        },
        {
            title: t.managerDashboard.stats.occupancyRate,
            value: `${occupancy}%`,
            change: 5.2,
            changeLabel: t.managerDashboard.stats.vsLastMonth,
            icon: Car,
            gradient: "from-accent to-emerald-400",
        },
        {
            title: t.managerDashboard.stats.activeBookings,
            value: activeBookings.toString(),
            change: -2.4,
            changeLabel: t.managerDashboard.stats.vsLastMonth,
            icon: Users,
            gradient: "from-yellow-500 to-orange-400",
        },
        {
            title: t.managerDashboard.stats.evSessions,
            value: evSessions.toString(),
            change: 18.3,
            changeLabel: t.managerDashboard.stats.vsLastMonth,
            icon: Zap,
            gradient: "from-purple-500 to-pink-400",
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative overflow-hidden rounded-2xl glass p-6 card-hover"
                >
                    {/* Background gradient */}
                    <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl`} />

                    {/* Icon */}
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Content */}
                    <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="mt-1 font-serif text-3xl font-bold">{stat.value}</p>

                        {/* Change indicator */}
                        <div className="mt-2 flex items-center gap-1">
                            {stat.change >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-accent" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-destructive" />
                            )}
                            <span className={stat.change >= 0 ? "text-accent" : "text-destructive"}>
                                {stat.change >= 0 ? "+" : ""}{stat.change}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {stat.changeLabel}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
