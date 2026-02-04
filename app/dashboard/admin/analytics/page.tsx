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

const growthData = [
    { name: "Week 1", users: 120, revenue: 5400 },
    { name: "Week 2", users: 240, revenue: 8900 },
    { name: "Week 3", users: 480, revenue: 15600 },
    { name: "Week 4", users: 950, revenue: 32400 },
]

const userDistribution = [
    { name: "Regular Users", value: 850, color: "#2563eb" },
    { name: "Managers", value: 142, color: "#8b5cf6" },
    { name: "Admins", value: 8, color: "#ef4444" },
]

export default function AdminAnalyticsPage() {
    const { t } = useTranslation()

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
                    { label: "Active Users (7d)", value: "2,840", trend: "+15.2%", up: true, icon: Users },
                    { label: "Gross Revenue", value: "€142.5K", trend: "+8.4%", up: true, icon: DollarSign },
                    { label: "Total Facilities", value: "385", trend: "+2.1%", up: true, icon: Building2 },
                    { label: "Avg. Transaction", value: "€12.40", trend: "-1.5%", up: false, icon: Activity },
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
                            <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.up ? "text-green-500" : "text-red-500"}`}>
                                {stat.trend} {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            </div>
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
