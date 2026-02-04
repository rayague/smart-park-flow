"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Zap,
    AlertTriangle,
    CheckCircle2,
    Settings2,
    Car
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "@/lib/i18n"

// Mock spots data
const spots = Array.from({ length: 48 }, (_, i) => ({
    id: `spot-${i + 1}`,
    name: `${String.fromCharCode(65 + Math.floor(i / 12))}-${(i % 12) + 1}`,
    status: Math.random() > 0.7 ? "occupied" : Math.random() > 0.9 ? "maintenance" : "available",
    type: Math.random() > 0.8 ? "ev" : "standard",
    lastUsed: "2h ago"
}))

export default function ProprietaireSpotsPage() {
    const { t } = useTranslation()
    const [filter, setFilter] = React.useState("all")

    const filteredSpots = spots.filter(s => {
        if (filter === "all") return true
        return s.status === filter || s.type === filter
    })

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                        {t.managerDashboard.navigation.spots}
                    </h1>
                    <p className="text-muted-foreground">
                        Real-time visualization and management of individual parking spots.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass gap-2">
                        <Settings2 className="h-4 w-4" />
                        Layout Config
                    </Button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center justify-between gap-6 rounded-2xl glass p-6"
            >
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-secondary" />
                        <span className="text-sm">Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <span className="text-sm">Maintenance</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-sm">EV Station</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px] glass">
                            <SelectValue placeholder="All Spots" />
                        </SelectTrigger>
                        <SelectContent className="glass">
                            <SelectItem value="all">All Spots</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="ev">EV Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {filteredSpots.map((spot, index) => (
                    <motion.div
                        key={spot.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className={`group relative flex aspect-square flex-col items-center justify-center rounded-xl glass border-2 transition-all hover:scale-105 ${spot.status === "available"
                            ? "border-primary/20 hover:border-primary"
                            : spot.status === "maintenance"
                                ? "border-yellow-500/20 hover:border-yellow-500"
                                : "border-transparent bg-secondary/50"
                            }`}
                    >
                        <span className="text-lg font-bold">{spot.name}</span>

                        <div className="mt-2 flex items-center gap-1">
                            {spot.status === "occupied" ? (
                                <Car className="h-4 w-4 text-muted-foreground" />
                            ) : spot.status === "maintenance" ? (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                            {spot.type === "ev" && (
                                <Zap className="h-3 w-3 text-blue-500 fill-blue-500" />
                            )}
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button size="sm" variant="ghost" className="h-8 text-[10px] uppercase tracking-tighter">
                                Manage
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
