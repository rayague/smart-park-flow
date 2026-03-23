"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Zap, Accessibility, Car } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { useBookingStore } from "@/lib/store"

interface ParkingSpot {
    id: string
    number: string
    floor: number
    type: "standard" | "ev" | "handicap"
    isOccupied: boolean
}

function mapDbSpot(s: any): ParkingSpot {
    return {
        id: s.id,
        number: s.number,
        floor: s.floor ?? 1,
        type: s.type === "EV" ? "ev" : "standard",
        isOccupied: s.status === "OCCUPIED" || s.status === "MAINTENANCE",
    }
}

export function SpotSelector() {
    const { t } = useTranslation()
    const { selectedSpot, setSelectedSpot } = useBookingStore()
    const parkingId = useBookingStore((s) => s.parkingId)
    const [currentFloor, setCurrentFloor] = React.useState(1)
    const [spots, setSpots] = React.useState<ParkingSpot[]>([])
    const [allSpots, setAllSpots] = React.useState<ParkingSpot[]>([])
    const [floors, setFloors] = React.useState<{ level: number; name: string }[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoading(true)
            try {
                const { supabase } = await import("@/lib/supabase")
                let query = supabase.from("spots").select("*")
                if (parkingId) query = query.eq("parking_id", parkingId)

                const { data, error } = await query.order("number")
                if (error) throw error

                if (!cancelled && data) {
                    const mapped = data.map(mapDbSpot)
                    setAllSpots(mapped)

                    const uniqueFloors = [...new Set(mapped.map((s) => s.floor))].sort()
                    if (uniqueFloors.length === 0) uniqueFloors.push(1)
                    setFloors(uniqueFloors.map((f) => ({ level: f, name: `Floor ${f}` })))
                    setCurrentFloor(uniqueFloors[0])
                }
            } catch (e) {
                console.error("Failed to load spots:", e)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [parkingId])

    React.useEffect(() => {
        setSpots(allSpots.filter((s) => s.floor === currentFloor))
    }, [currentFloor, allSpots])

    const getSpotIcon = (type: string) => {
        switch (type) {
            case "ev":
                return <Zap className="h-3 w-3" />
            case "handicap":
                return <Accessibility className="h-3 w-3" />
            default:
                return <Car className="h-3 w-3" />
        }
    }

    const getSpotColor = (spot: ParkingSpot) => {
        if (spot.isOccupied) return "bg-red-500/20 text-red-500 cursor-not-allowed"
        if (selectedSpot?.id === spot.id) return "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
        if (spot.type === "ev") return "bg-accent/20 text-accent hover:bg-accent hover:text-accent-foreground"
        if (spot.type === "handicap") return "bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white"
        return "bg-secondary hover:bg-primary hover:text-primary-foreground"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h2 className="font-serif text-2xl font-bold mb-2">
                    {t.booking.spotSelector.title}
                </h2>
                <p className="text-muted-foreground">
                    Choose an available parking spot on your preferred floor
                </p>
            </div>

            {/* Floor selector */}
            <div className="flex gap-2">
                {floors.map((floor) => (
                    <button
                        key={floor.level}
                        onClick={() => setCurrentFloor(floor.level)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            currentFloor === floor.level
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        )}
                    >
                        {t.booking.spotSelector.floor} {floor.level}
                    </button>
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-secondary" />
                    <span className="text-muted-foreground">{t.booking.spotSelector.available}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-red-500/20" />
                    <span className="text-muted-foreground">{t.booking.spotSelector.occupied}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-primary" />
                    <span className="text-muted-foreground">{t.booking.spotSelector.selected}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-accent/20" />
                    <span className="text-muted-foreground">{t.booking.spotSelector.evCharging}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-blue-500/20" />
                    <span className="text-muted-foreground">{t.booking.spotSelector.handicap}</span>
                </div>
            </div>

            {/* Parking grid */}
            <div className="rounded-2xl glass p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                        Loading spots...
                    </div>
                ) : spots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Car className="h-10 w-10 mb-3 opacity-40" />
                        <p>No spots found for this floor</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between mb-4 text-xs text-muted-foreground">
                            <span className="px-3 py-1 rounded-full bg-secondary">← Entry</span>
                            <span className="px-3 py-1 rounded-full bg-secondary">Exit →</span>
                        </div>

                        <div className="grid grid-cols-8 gap-2">
                            {spots.map((spot, index) => (
                                <motion.button
                                    key={spot.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    onClick={() => !spot.isOccupied && setSelectedSpot(spot as any)}
                                    disabled={spot.isOccupied}
                                    className={cn(
                                        "relative aspect-[3/4] rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-200",
                                        getSpotColor(spot)
                                    )}
                                >
                                    {getSpotIcon(spot.type)}
                                    <span className="text-[10px] font-semibold">{spot.number}</span>
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Selected spot info */}
            {selectedSpot && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-primary/10 border border-primary/20 p-4"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Selected Spot</p>
                            <p className="text-xl font-bold text-primary">
                                Spot {selectedSpot.number}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Floor</p>
                            <p className="text-xl font-bold">{selectedSpot.floor}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}
