"use client"

import * as React from "react"
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

const revenueBreakdown = [
    { name: "Standard", value: 65, color: "#2563eb" },
    { name: "EV Charging", value: 25, color: "#10b981" },
    { name: "Subscriptions", value: 10, color: "#8b5cf6" },
]

export function RevenueBreakdownChart() {
    return (
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
    )
}
