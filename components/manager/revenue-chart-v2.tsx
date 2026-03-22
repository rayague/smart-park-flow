"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    Cell
} from "recharts"
import { useTranslation } from "@/lib/i18n"
import { Reservation } from "@/lib/store"
import { 
    format, 
    eachMonthOfInterval, 
    subMonths, 
    isSameMonth, 
    subDays, 
    eachDayOfInterval, 
    isSameDay 
} from "date-fns"
import { cn } from "@/lib/utils"

interface RevenueChartProps {
    reservations: Reservation[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-border/50 bg-background/90 p-3 shadow-2xl backdrop-blur-md">
                <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
                <div className="flex flex-col gap-1">
                    <p className="text-lg font-black text-primary">
                        {payload[0].value.toLocaleString()}€
                    </p>
                    {payload[1] && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                            {payload[1].value} Bookings
                        </div>
                    )}
                </div>
            </div>
        )
    }
    return null
}

export function RevenueChart({ reservations }: RevenueChartProps) {
    const { t } = useTranslation()
    const [view, setView] = React.useState<"monthly" | "weekly">("monthly")

    const revenueData = React.useMemo(() => {
        if (view === "monthly") {
            const last12Months = eachMonthOfInterval({
                start: subMonths(new Date(), 11),
                end: new Date()
            })

            return last12Months.map(month => {
                const monthName = format(month, "MMM")
                const monthRevenue = reservations
                    .filter(r => r.status === "completed" || r.status === "active")
                    .filter(r => isSameMonth(new Date(r.startTime), month))
                    .reduce((acc, r) => acc + (r.totalPrice || 0), 0)
                
                const monthBookings = reservations
                    .filter(r => isSameMonth(new Date(r.startTime), month))
                    .length

                return { name: monthName, revenue: Math.round(monthRevenue), bookings: monthBookings }
            })
        } else {
            const last7Days = eachDayOfInterval({
                start: subDays(new Date(), 6),
                end: new Date()
            })

            return last7Days.map(day => {
                const dayName = format(day, "EEE")
                const dayRevenue = reservations
                    .filter(r => r.status === "completed" || r.status === "active")
                    .filter(r => isSameDay(new Date(r.startTime), day))
                    .reduce((acc, r) => acc + (r.totalPrice || 0), 0)

                return { name: dayName, revenue: Math.round(dayRevenue) }
            })
        }
    }, [reservations, view])

    const totalRevenue = React.useMemo(() => 
        revenueData.reduce((acc, curr) => acc + curr.revenue, 0), 
    [revenueData])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex h-full flex-col rounded-3xl border border-border/40 bg-card/30 p-6 backdrop-blur-sm"
        >
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h3 className="font-heading text-xl font-black uppercase tracking-tighter">
                        {t.managerDashboard.sections.revenueOverview}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-primary">{totalRevenue.toLocaleString()}€</span>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                            Real-time
                        </span>
                    </div>
                </div>

                <div className="flex bg-secondary/30 p-1 rounded-xl">
                    <button
                        onClick={() => setView("monthly")}
                        className={cn(
                            "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg",
                            view === "monthly" 
                                ? "bg-background text-primary shadow-sm" 
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setView("weekly")}
                        className={cn(
                            "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg",
                            view === "weekly" 
                                ? "bg-background text-primary shadow-sm" 
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Weekly
                    </button>
                </div>
            </div>

            <div className="h-64 sm:h-80 w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                    {view === "monthly" ? (
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                fontSize={10} 
                                fontWeight="bold" 
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                fontSize={10} 
                                fontWeight="bold"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(val) => `${val}€`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="hsl(var(--primary))"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#revGradient)"
                                animationDuration={2000}
                                animationEasing="ease-in-out"
                            />
                        </AreaChart>
                    ) : (
                        <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                fontSize={10} 
                                fontWeight="bold" 
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                fontSize={10} 
                                fontWeight="bold"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={(val) => `${val}€`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary))', opacity: 0.1 }} />
                            <Bar 
                                dataKey="revenue" 
                                radius={[6, 6, 0, 0]}
                                animationDuration={1500}
                            >
                                {revenueData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === revenueData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/20%)'} />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}
