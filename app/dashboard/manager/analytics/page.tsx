"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Download,
    Calendar as CalendarIcon,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Users,
    Zap,
    Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { RevenueChart } from "@/components/manager/revenue-chart"
import { OccupancyHeatmap } from "@/components/manager/occupancy-heatmap"
import { useTranslation } from "@/lib/i18n"
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
    Cell,
} from "recharts"

const peakHoursData = [
    { hour: "00:00", value: 10 },
    { hour: "04:00", value: 5 },
    { hour: "08:00", value: 85 },
    { hour: "10:00", value: 95 },
    { hour: "12:00", value: 80 },
    { hour: "14:00", value: 75 },
    { hour: "16:00", value: 90 },
    { hour: "18:00", value: 98 },
    { hour: "20:00", value: 60 },
    { hour: "22:00", value: 30 },
]

const revenueBreakdown = [
    { name: "Standard", value: 65, color: "#2563eb" },
    { name: "EV Charging", value: 25, color: "#10b981" },
    { name: "Subscriptions", value: 10, color: "#8b5cf6" },
]

export default function ManagerAnalyticsPage() {
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
                        {t.managerDashboard.navigation.analytics}
                    </h1>
                    <p className="text-muted-foreground">
                        Advanced insights and data visualization for your parking operations.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Last 30 Days
                    </Button>
                    <Button className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Avg. Occupancy", value: "78%", trend: "+12%", up: true, icon: TrendingUp },
                    { label: "Total Visitors", value: "1,240", trend: "+5%", up: true, icon: Users },
                    { label: "EV Usage", value: "482", trend: "+24%", up: true, icon: Zap },
                    { label: "Avg. Duration", value: "3.2h", trend: "-2%", up: false, icon: Clock },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl glass p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-green-500" : "text-red-500"}`}>
                                {stat.trend}
                                {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <RevenueChart />
                <OccupancyHeatmap />
            </div>

            {/* Secondary Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Peak Hours Line Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 rounded-2xl glass p-6"
                >
                    <h3 className="mb-6 font-serif text-lg font-bold">Peak Hours Occupancy</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={peakHoursData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${v}%`} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#2563eb' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Revenue Breakdown Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl glass p-6"
                >
                    <h3 className="mb-6 font-serif text-lg font-bold">Revenue Breakdown</h3>
                    <div className="flex flex-col items-center justify-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={revenueBreakdown}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {revenueBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 w-full space-y-2">
                            {revenueBreakdown.map((entry) => (
                                <div key={entry.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                        <span className="text-muted-foreground">{entry.name}</span>
                                    </div>
                                    <span className="font-bold">{entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
