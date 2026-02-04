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

// Generate mock spots
const generateSpots = (floor: number): ParkingSpot[] => {
    const spots: ParkingSpot[] = []
    const rows = ["A", "B", "C", "D"]

    rows.forEach((row) => {
        for (let i = 1; i <= 8; i++) {
            const random = Math.random()
            spots.push({
                id: `${floor}-${row}${i}`,
                number: `${row}${i}`,
                floor,
                type: random > 0.85 ? "ev" : random > 0.8 ? "handicap" : "standard",
                isOccupied: random < 0.4,
            })
        }
    })

    return spots
}

const floors = [
    { level: 1, name: "Floor 1" },
    { level: 2, name: "Floor 2" },
    { level: 3, name: "Floor 3" },
]

export function SpotSelector() {
    const { t } = useTranslation()
    const { selectedSpot, setSelectedSpot } = useBookingStore()
    const [currentFloor, setCurrentFloor] = React.useState(1)
    const [spots, setSpots] = React.useState<ParkingSpot[]>([])

    React.useEffect(() => {
        setSpots(generateSpots(currentFloor))
    }, [currentFloor])

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
                {/* Entry/Exit indicators */}
                <div className="flex justify-between mb-4 text-xs text-muted-foreground">
                    <span className="px-3 py-1 rounded-full bg-secondary">← Entry</span>
                    <span className="px-3 py-1 rounded-full bg-secondary">Exit →</span>
                </div>

                {/* Spots grid */}
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

                {/* Aisle indicator */}
                <div className="my-4 border-t-2 border-dashed border-border flex items-center justify-center">
                    <span className="px-3 py-1 -mt-3 bg-background text-xs text-muted-foreground">
                        Driving Aisle
                    </span>
                </div>

                {/* Second row of spots */}
                <div className="grid grid-cols-8 gap-2">
                    {spots.slice(0, 16).map((spot, index) => (
                        <motion.button
                            key={`lower-${spot.id}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.02 }}
                            onClick={() => !spot.isOccupied && setSelectedSpot({ ...spot, id: `lower-${spot.id}` } as any)}
                            disabled={spot.isOccupied}
                            className={cn(
                                "relative aspect-[3/4] rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-200",
                                getSpotColor({ ...spot, id: `lower-${spot.id}` })
                            )}
                        >
                            {getSpotIcon(spot.type)}
                            <span className="text-[10px] font-semibold">{spot.number}</span>
                        </motion.button>
                    ))}
                </div>
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
