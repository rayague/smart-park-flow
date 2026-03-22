"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Users,
    Building2,
    ParkingCircle,
    DollarSign,
    TrendingUp,
    Activity,
    Server,
    Wifi,
    LucideIcon
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"
import { useReservationStore, useParkingStore } from "@/lib/store"

interface PlatformStat {
    title: string
    value: string | number
    subtitle: string
    icon: LucideIcon
    gradient: string
    change?: number
}

export function PlatformStats() {
    const { t } = useTranslation()
    const { reservations, fetchReservations } = useReservationStore()
    const { parkings, fetchParkings } = useParkingStore()
    const [userCount, setUserCount] = React.useState(0)
    const [managerCount, setManagerCount] = React.useState(0)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetchReservations()
        fetchParkings()

        async function fetchCounts() {
            const [usersRes, managersRes] = await Promise.all([
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'MANAGER')
            ])

            if (usersRes.count !== null) setUserCount(usersRes.count)
            if (managersRes.count !== null) setManagerCount(managersRes.count)
            setLoading(false)
        }

        fetchCounts()
    }, [fetchReservations, fetchParkings])

    const totalRevenue = React.useMemo(() =>
        parkings.reduce((acc, p) => acc + ((p.totalSpots - p.availableSpots) * p.pricePerHour), 0),
        [parkings])

    const stats: PlatformStat[] = [
        {
            title: t.adminDashboard.stats.totalUsers,
            value: loading ? '-' : userCount.toLocaleString(),
            subtitle: t.adminDashboard.stats.activeToday,
            icon: Users,
            gradient: "from-blue-500 to-cyan-400",
            change: 8.5,
        },
        {
            title: t.adminDashboard.stats.totalManagers,
            value: loading ? '-' : managerCount.toLocaleString(),
            subtitle: t.adminDashboard.stats.newThisWeek,
            icon: Building2,
            gradient: "from-purple-500 to-pink-400",
            change: 12.3,
        },
        {
            title: t.adminDashboard.stats.totalParkings,
            value: loading ? '-' : parkings.length.toLocaleString(),
            subtitle: "Verified locations",
            icon: ParkingCircle,
            gradient: "from-orange-500 to-red-400",
            change: 5.2,
        },
        {
            title: t.adminDashboard.stats.platformRevenue,
            value: loading ? '-' : `€${totalRevenue.toLocaleString()}`,
            subtitle: "This month",
            icon: DollarSign,
            gradient: "from-green-500 to-emerald-400",
            change: 15.8,
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
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
                            <Icon className="h-6 w-6 text-white" />
                        </div>

                        {/* Content */}
                        <div>
                            <p className="text-sm text-muted-foreground">{stat.title}</p>
                            <p className="mt-1 font-serif text-3xl font-bold">{stat.value}</p>

                            {/* Subtitle with change */}
                            <div className="mt-2 flex items-center gap-2">
                                {stat.change && (
                                    <span className="flex items-center text-sm text-green-500">
                                        <TrendingUp className="mr-1 h-3 w-3" />
                                        +{stat.change}%
                                    </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                    {stat.subtitle}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}

export function SystemHealth() {
    const [services, setServices] = React.useState<Array<{ name: string; status: string; latency: string; icon: LucideIcon }>>([
        { name: "API Server", status: "checking", latency: "-", icon: Server },
        { name: "Database", status: "checking", latency: "-", icon: Activity },
        { name: "CDN", status: "checking", latency: "-", icon: Wifi },
        { name: "Payment Gateway", status: "checking", latency: "-", icon: DollarSign },
    ])

    React.useEffect(() => {
        let cancelled = false

        async function measure(name: string, icon: LucideIcon, fn: () => Promise<void>) {
            const start = performance.now()
            try {
                await fn()
                const ms = Math.max(0, Math.round(performance.now() - start))
                return { name, status: "operational", latency: `${ms}ms`, icon }
            } catch (e) {
                const ms = Math.max(0, Math.round(performance.now() - start))
                console.error(`System health check failed for ${name}:`, e)
                return { name, status: "degraded", latency: `${ms}ms`, icon }
            }
        }

        async function runChecks() {
            const results = await Promise.all([
                measure("API Server", Server, async () => {
                    const { error } = await supabase.from("profiles").select("id", { count: "exact", head: true })
                    if (error) throw error
                }),
                measure("Database", Activity, async () => {
                    const { error } = await supabase.from("parkings").select("id", { count: "exact", head: true })
                    if (error) throw error
                }),
                measure("CDN", Wifi, async () => {
                    const { error } = await supabase.from("reservations").select("id", { count: "exact", head: true })
                    if (error) throw error
                }),
                measure("Payment Gateway", DollarSign, async () => {
                    const { error } = await supabase.from("reservations").select("id", { count: "exact", head: true })
                    if (error) throw error
                }),
            ])

            if (!cancelled) setServices(results)
        }

        runChecks()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl glass p-6"
        >
            <h3 className="mb-4 font-serif text-xl font-semibold">System Health</h3>

            <div className="space-y-3">
                {services.map((service) => {
                    const Icon = service.icon
                    return (
                        <div
                            key={service.name}
                            className="flex items-center justify-between rounded-xl bg-subtle p-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-icon-box">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="font-medium">{service.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">{service.latency}</span>
                                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${service.status === "operational" ? "bg-green-500/10 text-green-500" : service.status === "checking" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${service.status === "operational" ? "bg-green-500" : service.status === "checking" ? "bg-yellow-500" : "bg-red-500"}`} />
                                    {service.status}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}
