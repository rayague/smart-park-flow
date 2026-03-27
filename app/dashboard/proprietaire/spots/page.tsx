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

import { useAuthStore, useParkingStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type DbSpot = Database['public']['Tables']['spots']['Row']

export default function ProprietaireSpotsPage() {
    const { t } = useTranslation()
    const { user } = useAuthStore()
    const { parkings, fetchParkings } = useParkingStore()
    
    const [spots, setSpots] = React.useState<DbSpot[]>([])
    const [loading, setLoading] = React.useState(true)
    const [filter, setFilter] = React.useState("all")
    const [selectedParkingId, setSelectedParkingId] = React.useState<string>("all")

    // Fetch initial data
    React.useEffect(() => {
        fetchParkings()
    }, [fetchParkings])

    const fetchSpots = React.useCallback(async () => {
        if (!user) return
        setLoading(true)

        try {
            let query = supabase.from('spots').select('*')

            if (selectedParkingId !== "all") {
                query = query.eq('parking_id', selectedParkingId)
            } else {
                const managerParkingIds = parkings.map(p => p.id)
                if (managerParkingIds.length > 0) {
                    query = query.in('parking_id', managerParkingIds)
                } else {
                    setSpots([])
                    setLoading(false)
                    return
                }
            }

            const { data, error } = await query.order('number', { ascending: true })
            if (error) throw error
            setSpots(data || [])
        } catch (err) {
            console.error('Failed to fetch spots:', err)
        } finally {
            setLoading(false)
        }
    }, [user, selectedParkingId, parkings])

    React.useEffect(() => {
        fetchSpots()
    }, [fetchSpots])

    // Real-time subscription
    React.useEffect(() => {
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'spots'
                },
                () => {
                    fetchSpots()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchSpots])

    const filteredSpots = spots.filter(s => {
        const status = s.status?.toLowerCase() || ''
        const type = s.type?.toLowerCase() || ''
        if (filter === "all") return true
        return status === filter || type === filter
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

                <div className="flex flex-wrap items-center gap-2">
                    {parkings.length > 1 && (
                        <Select value={selectedParkingId} onValueChange={setSelectedParkingId}>
                            <SelectTrigger className="w-[200px] glass">
                                <SelectValue placeholder="All Parkings" />
                            </SelectTrigger>
                            <SelectContent className="glass">
                                <SelectItem value="all">All Parkings</SelectItem>
                                {parkings.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px] glass">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="glass">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="ev">EV Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-xl glass animate-pulse" />
                    ))
                ) : filteredSpots.length > 0 ? (
                    filteredSpots.map((spot, index) => {
                        const status = spot.status?.toLowerCase() || 'available'
                        const type = spot.type?.toLowerCase() || 'regular'
                        
                        return (
                            <motion.div
                                key={spot.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.01 }}
                                className={`group relative flex aspect-square flex-col items-center justify-center rounded-xl glass border-2 transition-all hover:scale-105 ${status === "available"
                                    ? "border-primary/20 hover:border-primary"
                                    : status === "maintenance"
                                        ? "border-yellow-500/20 hover:border-yellow-500"
                                        : "border-transparent bg-subtle"
                                    }`}
                            >
                                <span className="text-lg font-bold">{spot.number}</span>

                                <div className="mt-2 flex items-center gap-1">
                                    {status === "occupied" ? (
                                        <Car className="h-4 w-4 text-muted-foreground" />
                                    ) : status === "maintenance" ? (
                                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    ) : (
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                    )}
                                    {type === "ev" && (
                                        <Zap className="h-3 w-3 text-blue-500 fill-blue-500" />
                                    )}
                                </div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button size="sm" variant="ghost" className="h-8 text-[10px] uppercase tracking-tighter">
                                        Manage
                                    </Button>
                                </div>
                            </motion.div>
                        )
                    })
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground glass rounded-2xl">
                        No spots found for this criteria.
                    </div>
                )}
            </div>
        </div>
    )
}
