"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    TrendingUp,
    Users,
    Building2,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Download,
    PieChart as PieIcon,
    BarChart as BarIcon,
    Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts"

type WeeklyPoint = { name: string; users: number; revenue: number }
type DistributionPoint = { name: string; value: number; color: string }

export default function AdminAnalyticsPage() {
    const { t } = useTranslation()

    const [loading, setLoading] = React.useState(true)
    const [growthData, setGrowthData] = React.useState<WeeklyPoint[]>([])
    const [userDistribution, setUserDistribution] = React.useState<DistributionPoint[]>([])
    const [activeUsers7d, setActiveUsers7d] = React.useState<number | null>(null)
    const [grossRevenue, setGrossRevenue] = React.useState<number | null>(null)
    const [totalFacilities, setTotalFacilities] = React.useState<number | null>(null)
    const [avgTransaction, setAvgTransaction] = React.useState<number | null>(null)

    React.useEffect(() => {
        async function fetchAnalytics() {
            setLoading(true)
            try {
                const now = new Date()
                const start7d = new Date(now)
                start7d.setDate(now.getDate() - 7)

                const start30d = new Date(now)
                start30d.setDate(now.getDate() - 30)

                const weeks: Array<{ label: string; start: Date; end: Date }> = []
                for (let i = 3; i >= 0; i--) {
                    const end = new Date(now)
                    end.setDate(now.getDate() - i * 7)
                    const start = new Date(end)
                    start.setDate(end.getDate() - 7)
                    weeks.push({ label: `Week ${4 - i}`, start, end })
                }

                const [profilesRes, facilitiesRes, reservations30dRes] = await Promise.all([
                    supabase.from("profiles").select("id, role"),
                    supabase.from("parkings").select("id", { count: "exact", head: true }),
                    supabase
                        .from("reservations")
                        .select("id, total_price, created_at")
                        .gte("created_at", start30d.toISOString())
                        .order("created_at", { ascending: true }),
                ])

                const reservations7dRes = await supabase
                    .from("reservations")
                    .select("user_id")
                    .gte("created_at", start7d.toISOString())

                if (!reservations7dRes.error) {
                    const setUsers = new Set((reservations7dRes.data || []).map((r: any) => r.user_id).filter(Boolean))
                    setActiveUsers7d(setUsers.size)
                } else {
                    setActiveUsers7d(0)
                }

                if (!reservations30dRes.error) {
                    const rows = reservations30dRes.data || []
                    const sum = rows.reduce((acc: number, r: any) => acc + (Number(r.total_price) || 0), 0)
                    setGrossRevenue(sum)
                    setAvgTransaction(rows.length ? sum / rows.length : 0)

                    const weekly: WeeklyPoint[] = weeks.map((w) => {
                        const inRange = rows.filter((r: any) => {
                            const d = new Date(r.created_at)
                            return d >= w.start && d < w.end
                        })
                        const revenue = inRange.reduce((acc: number, r: any) => acc + (Number(r.total_price) || 0), 0)
                        const users = new Set(inRange.map((r: any) => r.id))
                        return { name: w.label, users: inRange.length, revenue }
                    })
                    setGrowthData(weekly)
                } else {
                    setGrossRevenue(0)
                    setAvgTransaction(0)
                    setGrowthData(weeks.map((w) => ({ name: w.label, users: 0, revenue: 0 })))
                }

                setTotalFacilities(facilitiesRes.count ?? 0)

                const roleCounts = new Map<string, number>([
                    ["USER", 0],
                    ["MANAGER", 0],
                    ["ADMIN", 0],
                ])
                for (const p of profilesRes.data || []) {
                    const role = (p as any).role
                    if (roleCounts.has(role)) roleCounts.set(role, (roleCounts.get(role) || 0) + 1)
                }

                setUserDistribution([
                    { name: "Regular Users", value: roleCounts.get("USER") || 0, color: "#2563eb" },
                    { name: "Managers", value: roleCounts.get("MANAGER") || 0, color: "#8b5cf6" },
                    { name: "Admins", value: roleCounts.get("ADMIN") || 0, color: "#ef4444" },
                ])
            } catch (e) {
                console.error("Failed to load admin analytics:", e)
                setGrowthData([
                    { name: "Week 1", users: 0, revenue: 0 },
                    { name: "Week 2", users: 0, revenue: 0 },
                    { name: "Week 3", users: 0, revenue: 0 },
                    { name: "Week 4", users: 0, revenue: 0 },
                ])
                setUserDistribution([
                    { name: "Regular Users", value: 0, color: "#2563eb" },
                    { name: "Managers", value: 0, color: "#8b5cf6" },
                    { name: "Admins", value: 0, color: "#ef4444" },
                ])
                setActiveUsers7d(0)
                setGrossRevenue(0)
                setTotalFacilities(0)
                setAvgTransaction(0)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                        {t.adminDashboard.navigation.analytics}
                    </h1>
                    <p className="text-muted-foreground">
                        Platform-wide performance monitoring and growth metrics.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass gap-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </motion.div>

            {/* High Level Stats */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        label: "Active Users (7d)",
                        value: loading ? "-" : (activeUsers7d ?? 0).toLocaleString(),
                        trend: "",
                        up: true,
                        icon: Users,
                    },
                    {
                        label: "Gross Revenue",
                        value: loading ? "-" : `€${Math.round(grossRevenue ?? 0).toLocaleString()}`,
                        trend: "",
                        up: true,
                        icon: DollarSign,
                    },
                    {
                        label: "Total Facilities",
                        value: loading ? "-" : (totalFacilities ?? 0).toLocaleString(),
                        trend: "",
                        up: true,
                        icon: Building2,
                    },
                    {
                        label: "Avg. Transaction",
                        value: loading ? "-" : `€${(avgTransaction ?? 0).toFixed(2)}`,
                        trend: "",
                        up: true,
                        icon: Activity,
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl glass p-6 border-l-4 border-primary"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                            {stat.trend ? (
                                <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.up ? "text-green-500" : "text-red-500"}`}>
                                    {stat.trend}{" "}
                                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                </div>
                            ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-black">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Growth Area Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl glass p-6"
                >
                    <h3 className="mb-6 font-serif text-lg font-bold">Platform Growth (Monthly)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip />
                                <Area type="monotone" dataKey="users" stroke="#2563eb" fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* User Distribution Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl glass p-6"
                >
                    <h3 className="mb-6 font-serif text-lg font-bold">User Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={userDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
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
                    <div className="flex justify-center gap-6 mt-4">
                        {userDistribution.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-2 text-xs">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-muted-foreground">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
