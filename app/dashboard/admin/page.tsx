"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts"
import { PlatformStats, SystemHealth } from "@/components/admin/platform-stats"
import { ActivityFeed } from "@/components/admin/activity-feed"
import { UsersTable } from "@/components/admin/users-table"
import { useAuthStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"

type GrowthPoint = { month: string; users: number }
type DistributionPoint = { name: string; value: number; color: string }

interface CustomTooltipProps {
    active?: boolean
    payload?: Array<{ value: number; name: string }>
    label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        return (
            <div className="glass rounded-lg p-3 shadow-lg border border-border/50">
                <p className="text-sm font-medium">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                        {entry.name}: <span className="font-semibold text-foreground">{entry.value.toLocaleString()}</span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export default function AdminDashboard() {
    const { user } = useAuthStore()
    const { t } = useTranslation()

    const [userGrowthData, setUserGrowthData] = React.useState<GrowthPoint[]>([])
    const [userDistribution, setUserDistribution] = React.useState<DistributionPoint[]>([
        { name: "Users", value: 0, color: "#2563eb" },
        { name: "Managers", value: 0, color: "#8b5cf6" },
        { name: "Admins", value: 0, color: "#ef4444" },
    ])

    React.useEffect(() => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)

        async function fetchDashboardData() {
            try {
                const [profilesRes, usersCountRes, managersCountRes, adminsCountRes] = await Promise.all([
                    supabase
                        .from("profiles")
                        .select("created_at")
                        .gte("created_at", start.toISOString())
                        .order("created_at", { ascending: true }),
                    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "USER"),
                    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "MANAGER"),
                    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "ADMIN"),
                ])

                if (!profilesRes.error) {
                    const buckets = new Map<string, number>()
                    for (let i = 0; i < 6; i++) {
                        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
                        const key = d.toLocaleString("en-US", { month: "short" })
                        buckets.set(key, 0)
                    }

                    for (const row of profilesRes.data || []) {
                        const d = new Date((row as any).created_at)
                        const key = d.toLocaleString("en-US", { month: "short" })
                        if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + 1)
                    }

                    let cumulative = 0
                    const growth: GrowthPoint[] = Array.from(buckets.entries()).map(([month, count]) => {
                        cumulative += count
                        return { month, users: cumulative }
                    })
                    setUserGrowthData(growth)
                }

                setUserDistribution([
                    { name: "Users", value: usersCountRes.count ?? 0, color: "#2563eb" },
                    { name: "Managers", value: managersCountRes.count ?? 0, color: "#8b5cf6" },
                    { name: "Admins", value: adminsCountRes.count ?? 0, color: "#ef4444" },
                ])
            } catch (e) {
                console.error("Failed to load admin dashboard stats:", e)
            }
        }

        fetchDashboardData()
    }, [])

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-1"
            >
                <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                    {t.adminDashboard.title}
                </h1>
                <p className="text-muted-foreground">
                    {t.adminDashboard.subtitle}
                </p>
            </motion.div>

            {/* Platform Stats */}
            <PlatformStats />

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* User Growth Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 rounded-2xl glass p-6"
                >
                    <h3 className="mb-6 font-serif text-xl font-semibold">User Growth</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis
                                    dataKey="month"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ fill: "#2563eb", strokeWidth: 2 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* User Distribution Pie */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl glass p-6"
                >
                    <h3 className="mb-4 font-serif text-xl font-semibold">User Distribution</h3>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={userDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {userDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {userDistribution.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-muted-foreground">{item.name}</span>
                                </div>
                                <span className="font-medium">{item.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Activity and System Health */}
            <div className="grid gap-6 lg:grid-cols-2">
                <ActivityFeed />
                <SystemHealth />
            </div>

            {/* Users Table */}
            <UsersTable />
        </div>
    )
}
