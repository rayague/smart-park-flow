"use client"

import * as React from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
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

export function PeakHoursChart() {
    return (
        <div className="h-[300px] w-full">
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
    )
}
