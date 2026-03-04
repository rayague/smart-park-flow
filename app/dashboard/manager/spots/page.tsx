"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Filter,
    Search,
    Car,
    Zap,
    AlertTriangle,
    CheckCircle2,
    Settings2,
    ChevronDown,
    Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"
import { useAuthStore, useParkingStore } from "@/lib/store"
import { useSearchParams } from "next/navigation"
import { SpotEditModal } from "@/components/manager/spot-edit-modal"

export default function ManagerSpotsPage() {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const urlParkingId = searchParams?.get("parkingId")

    const [filter, setFilter] = React.useState("all")
    const [selectedParkingId, setSelectedParkingId] = React.useState<string | null>(null)
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [editingSpot, setEditingSpot] = React.useState<any>(null)
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)

    const { user } = useAuthStore()
    const { parkings, fetchParkings } = useParkingStore()
    const [spots, setSpots] = React.useState<
        Array<{
            id: string
            name: string
            status: "occupied" | "maintenance" | "available"
            type: "ev" | "standard"
        }>
    >([])

    React.useEffect(() => {
        fetchParkings()
    }, [fetchParkings])

    // Set initial parking selection
    React.useEffect(() => {
        if (parkings.length > 0 && !selectedParkingId) {
            // If we have a parkingId in the URL, use it, otherwise use the first parking
            if (urlParkingId && parkings.some(p => p.id === urlParkingId)) {
                setSelectedParkingId(urlParkingId)
            } else {
                setSelectedParkingId(parkings[0].id)
            }
        }
    }, [parkings, selectedParkingId, urlParkingId])

    const fetchSpots = React.useCallback(async () => {
        if (!selectedParkingId) return

        const { data, error } = await supabase
            .from("spots")
            .select("*")
            .eq("parking_id", selectedParkingId)
            .order("number", { ascending: true })

        if (error) {
            console.error("Failed to load spots:", error)
            setSpots([])
            return
        }

        setSpots(
            (data || []).map((s) => ({
                id: s.id,
                name: s.number,
                status:
                    s.status === "OCCUPIED"
                        ? "occupied"
                        : s.status === "MAINTENANCE"
                            ? "maintenance"
                            : "available",
                type: s.type === "EV" ? "ev" : "standard",
            }))
        )
    }, [selectedParkingId])

    React.useEffect(() => {
        fetchSpots()
    }, [fetchSpots])

    const handleGenerateSpots = async () => {
        const parking = parkings.find(p => p.id === selectedParkingId)
        if (!parking) return

        setIsGenerating(true)
        try {
            const response = await fetch('/api/spots/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parkingId: parking.id,
                    totalSpots: parking.totalSpots
                })
            })

            const result = await response.json()
            if (!response.ok) throw new Error(result.message || "Failed to generate spots")

            alert(`${result.length} places ont été générées !`)
            await fetchSpots()
        } catch (err: any) {
            console.error("Failed to generate spots:", err)
            alert(`Erreur: ${err.message}`)
        } finally {
            setIsGenerating(false)
        }
    }

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

            {/* Legend & Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center justify-between gap-6 rounded-2xl glass p-6"
            >
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Select value={selectedParkingId || ""} onValueChange={setSelectedParkingId}>
                            <SelectTrigger className="w-[240px] glass border-primary/20">
                                <SelectValue placeholder="Select a parking" />
                            </SelectTrigger>
                            <SelectContent className="glass">
                                {parkings.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-8 w-px bg-border/50 hidden md:block" />

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
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {spots.length === 0 && selectedParkingId && (
                        <Button
                            variant="default"
                            size="sm"
                            className="gap-2"
                            onClick={handleGenerateSpots}
                            disabled={isGenerating}
                        >
                            {isGenerating ? "Generating..." : "Generate Spots"}
                        </Button>
                    )}
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

            {/* Empty State */}
            {spots.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground glass rounded-2xl border-dashed border-2 border-primary/10">
                    <Car className="h-16 w-16 mb-4 opacity-10" />
                    <h3 className="text-lg font-medium text-foreground">No spots found</h3>
                    <p className="max-w-xs text-center mt-2">
                        {selectedParkingId
                            ? "This parking doesn't have any spots generated yet. Click the button above to create them."
                            : "Select a parking to manage its spots."
                        }
                    </p>
                    {selectedParkingId && (
                        <Button
                            variant="outline"
                            className="mt-6 gap-2"
                            onClick={handleGenerateSpots}
                            disabled={isGenerating}
                        >
                            <Plus className="h-4 w-4" />
                            Generate {parkings.find(p => p.id === selectedParkingId)?.totalSpots} Spots
                        </Button>
                    )}
                </div>
            )}

            {/* Spots Grid */}
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
                                : "border-transparent bg-subtle"
                            }`}
                    >
                        {/* Spot Content */}
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

                        {/* Status Tooltip/Overlay on click or hover simplified */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-[10px] uppercase tracking-tighter"
                                onClick={() => {
                                    setEditingSpot(spot)
                                    setIsEditModalOpen(true)
                                }}
                            >
                                Manage
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <SpotEditModal
                spot={editingSpot}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSuccess={fetchSpots}
            />
        </div>
    )
}
