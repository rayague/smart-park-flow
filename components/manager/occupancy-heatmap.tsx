"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

// Occupancy data for each hour of the week
const occupancyData = [
    // Sunday
    [20, 25, 30, 28, 35, 45, 55, 65, 75, 85, 90, 95, 92, 88, 82, 78, 72, 68, 60, 50, 40, 35, 30, 25],
    // Monday
    [15, 12, 10, 10, 15, 35, 65, 85, 95, 98, 95, 92, 88, 90, 92, 95, 98, 90, 75, 60, 45, 35, 25, 18],
    // Tuesday
    [15, 12, 10, 10, 15, 38, 68, 88, 95, 98, 96, 94, 90, 92, 94, 96, 98, 92, 78, 62, 48, 38, 28, 20],
    // Wednesday
    [18, 15, 12, 12, 18, 40, 70, 90, 96, 99, 97, 95, 92, 94, 96, 97, 99, 94, 80, 65, 50, 40, 30, 22],
    // Thursday
    [16, 14, 11, 11, 16, 36, 66, 86, 94, 97, 95, 93, 89, 91, 93, 95, 97, 91, 76, 61, 46, 36, 26, 19],
    // Friday
    [18, 15, 12, 12, 18, 42, 72, 92, 98, 100, 98, 96, 94, 96, 98, 100, 98, 85, 70, 55, 42, 35, 28, 22],
    // Saturday
    [25, 22, 18, 16, 20, 30, 45, 60, 75, 88, 95, 98, 96, 92, 88, 85, 82, 78, 72, 65, 55, 45, 38, 30],
]

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`)

function getColor(value: number): string {
    if (value >= 90) return "bg-red-500"
    if (value >= 75) return "bg-orange-500"
    if (value >= 50) return "bg-yellow-500"
    if (value >= 25) return "bg-green-500"
    return "bg-emerald-300"
}

function getOpacity(value: number): number {
    return 0.3 + (value / 100) * 0.7
}

export function OccupancyHeatmap() {
    const { t } = useTranslation()
    const [hoveredCell, setHoveredCell] = React.useState<{
        day: number
        hour: number
        value: number
    } | null>(null)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass p-6"
        >
            <div className="mb-6 flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold">
                    {t.managerDashboard.sections.occupancyHeatmap}
                </h3>

                {/* Legend */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                            <div className="h-3 w-3 rounded-sm bg-emerald-300" />
                            <div className="h-3 w-3 rounded-sm bg-green-500" />
                            <div className="h-3 w-3 rounded-sm bg-yellow-500" />
                            <div className="h-3 w-3 rounded-sm bg-orange-500" />
                            <div className="h-3 w-3 rounded-sm bg-red-500" />
                        </div>
                        <span className="text-xs text-muted-foreground">0% - 100%</span>
                    </div>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    {/* Hour labels */}
                    <div className="mb-1 flex pl-12">
                        {hours.filter((_, i) => i % 3 === 0).map((hour) => (
                            <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
                                {hour}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="space-y-1">
                        {days.map((day, dayIndex) => (
                            <div key={day} className="flex items-center gap-2">
                                <span className="w-10 text-xs text-muted-foreground text-right">
                                    {day}
                                </span>
                                <div className="flex flex-1 gap-0.5">
                                    {occupancyData[dayIndex].map((value, hourIndex) => (
                                        <motion.div
                                            key={`${dayIndex}-${hourIndex}`}
                                            className={`h-6 flex-1 rounded-sm cursor-pointer transition-all ${getColor(value)}`}
                                            style={{ opacity: getOpacity(value) }}
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

            {/* Tooltip */}
            {hoveredCell && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-4 text-sm"
                >
                    <span className="text-muted-foreground">
                        {days[hoveredCell.day]} at {hours[hoveredCell.hour]}:
                    </span>
                    <span className={`font-bold ${hoveredCell.value >= 90 ? "text-red-500" :
                            hoveredCell.value >= 75 ? "text-orange-500" :
                                hoveredCell.value >= 50 ? "text-yellow-500" :
                                    "text-green-500"
                        }`}>
                        {hoveredCell.value}% occupancy
                    </span>
                </motion.div>
            )}

            {/* Insights */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/50 pt-4">
                <div>
                    <p className="text-sm text-muted-foreground">Peak Hours</p>
                    <p className="font-semibold">9AM - 11AM</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Busiest Day</p>
                    <p className="font-semibold">Friday</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Low Traffic</p>
                    <p className="font-semibold">2AM - 5AM</p>
                </div>
            </div>
        </motion.div>
    )
}
