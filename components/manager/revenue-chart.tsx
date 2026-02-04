"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts"
import { useTranslation } from "@/lib/i18n"

const revenueData = [
    { name: "Jan", revenue: 4000, bookings: 240 },
    { name: "Feb", revenue: 3000, bookings: 198 },
    { name: "Mar", revenue: 5000, bookings: 320 },
    { name: "Apr", revenue: 4500, bookings: 278 },
    { name: "May", revenue: 6000, bookings: 390 },
    { name: "Jun", revenue: 5500, bookings: 340 },
    { name: "Jul", revenue: 7000, bookings: 420 },
    { name: "Aug", revenue: 6500, bookings: 380 },
    { name: "Sep", revenue: 8000, bookings: 480 },
    { name: "Oct", revenue: 7500, bookings: 450 },
    { name: "Nov", revenue: 9000, bookings: 520 },
    { name: "Dec", revenue: 8500, bookings: 490 },
]

const weeklyData = [
    { day: "Mon", revenue: 1200 },
    { day: "Tue", revenue: 1800 },
    { day: "Wed", revenue: 2200 },
    { day: "Thu", revenue: 1900 },
    { day: "Fri", revenue: 2800 },
    { day: "Sat", revenue: 3200 },
    { day: "Sun", revenue: 2400 },
]

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
                        {entry.name}: <span className="font-semibold text-foreground">${entry.value}</span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export function RevenueChart() {
    const { t } = useTranslation()
    const [view, setView] = React.useState<"monthly" | "weekly">("monthly")

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass p-6"
        >
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold">
                    {t.managerDashboard.sections.revenueOverview}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView("monthly")}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${view === "monthly"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-secondary"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setView("weekly")}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${view === "weekly"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-secondary"
                            }`}
                    >
                        Weekly
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {view === "monthly" ? (
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                dataKey="name"
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
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#2563eb"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    ) : (
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                dataKey="day"
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
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="revenue"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Summary stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/50 pt-4">
                <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-xl font-bold text-primary">$68,500</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Avg. Daily</p>
                    <p className="text-xl font-bold text-accent">$2,283</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Growth</p>
                    <p className="text-xl font-bold text-green-500">+12.5%</p>
                </div>
            </div>
        </motion.div>
    )
}
