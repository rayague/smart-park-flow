"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"
import { Reservation } from "@/lib/store"
import { getHours, getDay } from "date-fns"

interface OccupancyHeatmapProps {
    reservations: Reservation[]
}

export function OccupancyHeatmap({ reservations }: OccupancyHeatmapProps) {
    const { t } = useTranslation()
    const [hoveredCell, setHoveredCell] = React.useState<{
        day: number
        hour: number
        value: number
    } | null>(null)

    // Calculate real occupancy data from reservations
    const occupancyData = React.useMemo(() => {
        // Initialize 7x24 grid with 0s
        const grid = Array.from({ length: 7 }, () => Array(24).fill(0))
        
        // Count active/completed reservations per slot
        reservations.forEach(res => {
            if (res.status === 'cancelled') return
            
            const start = new Date(res.startTime)
            const end = new Date(res.endTime)
            
            // For simplicity, we mark only the start hour's slot
            // In a pro version, we would loop between start and end hours
            const day = getDay(start) // 0 (Sun) to 6 (Sat)
            const hour = getHours(start)
            
            if (day >= 0 && day < 7 && hour >= 0 && hour < 24) {
                grid[day][hour] += 1
            }
        })

        // Normalize data to a 0-100 percentage scale for the heatmap
        // We assume 10 is "max occupancy" for the visualization scale if data is sparse
        const maxVal = Math.max(...grid.flat(), 5) 
        return grid.map(dayRow => dayRow.map(val => Math.min(Math.round((val / maxVal) * 100), 100)))
    }, [reservations])

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass p-4 sm:p-6 w-full overflow-hidden"
        >
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="font-heading text-xl font-black uppercase tracking-tighter">
                    {t.managerDashboard.sections.occupancyHeatmap}
                </h3>

                {/* Legend */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                            <div className="h-3 w-3 rounded-sm bg-emerald-500/20" />
                            <div className="h-3 w-3 rounded-sm bg-emerald-500/50" />
                            <div className="h-3 w-3 rounded-sm bg-emerald-500" />
                            <div className="h-3 w-3 rounded-sm bg-primary" />
                            <div className="h-3 w-3 rounded-sm bg-accent" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">0% - 100%</span>
                    </div>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-4 scrollbar-hide">
                <div className="min-w-[500px]">
                    {/* Hour labels */}
                    <div className="mb-2 flex pl-10">
                        {hours.filter((_, i) => i % 4 === 0).map((hour) => (
                            <div key={hour} className="flex-1 text-center text-[10px] font-black uppercase tracking-tighter text-muted-foreground/50">
                                {hour}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="space-y-1.5">
                        {days.map((day, dayIndex) => (
                            <div key={day} className="flex items-center gap-2">
                                <span className="w-8 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                    {day}
                                </span>
                                <div className="flex flex-1 gap-1">
                                    {occupancyData[dayIndex].map((value, hourIndex) => (
                                        <motion.div
                                            key={`${dayIndex}-${hourIndex}`}
                                            className={cn(
                                                "h-6 flex-1 rounded-sm cursor-pointer transition-all",
                                                value === 0 ? "bg-secondary/20" : 
                                                value < 30 ? "bg-emerald-500/30" :
                                                value < 60 ? "bg-emerald-500" :
                                                value < 90 ? "bg-primary" : "bg-accent"
                                            )}
                                            whileHover={{ scale: 1.2, zIndex: 10 }}
                                            onMouseEnter={() => setHoveredCell({ day: dayIndex, hour: hourIndex, value })}
                                            onMouseLeave={() => setHoveredCell(null)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tooltip or Dynamic Info */}
            <div className="h-10 mt-2">
                {hoveredCell ? (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-xs"
                    >
                        <span className="font-black uppercase tracking-widest text-muted-foreground px-2 py-1 bg-secondary rounded-md">
                            {days[hoveredCell.day]}
                        </span>
                        <span className="font-black uppercase tracking-widest text-muted-foreground px-2 py-1 bg-secondary rounded-md">
                            {hours[hoveredCell.hour]}
                        </span>
                        <span className={cn(
                            "font-black uppercase tracking-widest px-2 py-1 rounded-md",
                            hoveredCell.value >= 75 ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                        )}>
                            {hoveredCell.value}% Occupancy
                        </span>
                    </motion.div>
                ) : (
                    <p className="text-[10px] font-medium text-muted-foreground italic">
                        Hover over the grid to see detailed hourly occupancy...
                    </p>
                )}
            </div>
        </motion.div>
    )
}

function getColor(value: number): string {
    if (value >= 90) return "bg-accent"
    if (value >= 75) return "bg-primary"
    if (value >= 50) return "bg-emerald-500"
    if (value >= 25) return "bg-emerald-500/50"
    return "bg-emerald-500/20"
}

import { cn } from "@/lib/utils"
