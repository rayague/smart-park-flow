"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Search,
    MapPin,
    Building2,
    Car,
    MoreHorizontal,
    Table as TableIcon,
    LayoutGrid
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"
import { useReservationStore } from "@/lib/store"

interface ParkingData {
    id: string
    name: string
    manager: string
    location: string
    status: string
    spots: number
    revenue: number
}

export default function AdminParkingsPage() {
    const { t } = useTranslation()
    const { reservations } = useReservationStore()
    const [parkings, setParkings] = React.useState<ParkingData[]>([])
    const [loading, setLoading] = React.useState(true)
    const [viewMode, setViewMode] = React.useState<"grid" | "table">("table")
    const [searchQuery, setSearchQuery] = React.useState("")

    React.useEffect(() => {
        async function fetchParkings() {
            const { data, error } = await supabase
                .from('parkings')
                .select('*, profiles:owner_id(full_name)')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Failed to fetch parkings:', error)
                setParkings([])
            } else {
                const mapped: ParkingData[] = (data || []).map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    manager: p.profiles?.full_name || 'Unknown',
                    location: `${p.city || ''}${p.address ? `, ${p.address}` : ''}`,
                    status: p.status?.toLowerCase() || 'active',
                    spots: p.total_spots || 0,
                    revenue: (p.total_spots - p.available_spots) * p.price_per_hour || 0,
                }))
                setParkings(mapped)
            }
            setLoading(false)
        }

        fetchParkings()
    }, [reservations])

    const filteredParkings = parkings.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.manager.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                        {t.adminDashboard.navigation.parkings}
                    </h1>
                    <p className="text-muted-foreground">
                        Global overview of all parking facilities registered on the platform.
                    </p>
                </div>
                <div className="flex items-center gap-2 border border-border/50 rounded-lg p-1 glass">
                    <Button
                        variant={viewMode === "table" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className="gap-2"
                    >
                        <TableIcon className="h-4 w-4" /> Table
                    </Button>
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="gap-2"
                    >
                        <LayoutGrid className="h-4 w-4" /> Grid
                    </Button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4"
            >
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search all parkings..."
                        className="pl-9 glass"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="glass">Advanced Filters</Button>
            </motion.div>

            {viewMode === "table" ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl glass p-6 overflow-x-auto"
                >
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Facility</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Manager</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Location</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Spots</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Revenue</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {loading ? (
                                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading...</td></tr>
                            ) : filteredParkings.length === 0 ? (
                                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No parkings found</td></tr>
                            ) : (
                                filteredParkings.map((parking, i) => (
                                    <tr key={parking.id} className="group hover:bg-primary/5 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-primary-box flex items-center justify-center text-primary">
                                                    <Car className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">{parking.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                {parking.manager}
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {parking.location}
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm font-bold">{parking.spots}</td>
                                        <td className="py-4 text-sm font-bold">€{parking.revenue.toLocaleString()}</td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${parking.status === "active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                                }`}>
                                                {parking.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </motion.div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <div className="col-span-full py-8 text-center text-muted-foreground">Loading...</div>
                    ) : filteredParkings.length === 0 ? (
                        <div className="col-span-full py-8 text-center text-muted-foreground">No parkings found</div>
                    ) : (
                        filteredParkings.map((parking, i) => (
                            <motion.div
                                key={parking.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="rounded-2xl glass p-6 card-hover"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary-box flex items-center justify-center text-primary">
                                        <Car className="h-5 w-5" />
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${parking.status === "active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                        }`}>
                                        {parking.status}
                                    </span>
                                </div>
                                <h3 className="font-serif text-lg font-bold mb-1">{parking.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                                    <Building2 className="h-3 w-3" /> Managed by {parking.manager}
                                </p>
                                <div className="grid grid-cols-2 gap-4 mt-auto border-t border-border/50 pt-4">
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground tracking-widest">Spots</p>
                                        <p className="font-bold">{parking.spots}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground tracking-widest">Revenue</p>
                                        <p className="font-bold">€{parking.revenue.toLocaleString()}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )))}
                </div>
            )}
        </div>
    )
}
