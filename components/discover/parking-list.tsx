"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
    MapPin,
    Star,
    Zap,
    Shield,
    Car,
    Clock,
    ArrowRight,
    Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { useParkingStore, useAuthStore, type Parking } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import type { FilterState } from "./parking-filters"

interface ParkingListProps {
    filters?: FilterState
}

export function ParkingList({ filters }: ParkingListProps) {
    const { t } = useTranslation()
    const { parkings: allParkings } = useParkingStore()

    const parkings = React.useMemo(() => {
        let result = [...allParkings]

        if (filters) {
            if (filters.location.trim()) {
                const q = filters.location.toLowerCase()
                result = result.filter(
                    (p) =>
                        p.name.toLowerCase().includes(q) ||
                        p.address.toLowerCase().includes(q) ||
                        p.city.toLowerCase().includes(q)
                )
            }

            result = result.filter(
                (p) => p.pricePerHour >= filters.priceRange[0] && p.pricePerHour <= filters.priceRange[1]
            )

            if (filters.amenities.size > 0) {
                const amenityMap: Record<string, (p: Parking) => boolean> = {
                    ev: (p) => p.hasEvCharging || p.amenities.includes("ev"),
                    cctv: (p) => p.amenities.includes("cctv"),
                    covered: (p) => p.amenities.includes("covered"),
                    "24h": (p) => p.amenities.includes("24h"),
                }
                result = result.filter((p) =>
                    Array.from(filters.amenities).every((a) => amenityMap[a]?.(p) ?? true)
                )
            }

            if (filters.sortBy === "Price: Low to High") {
                result.sort((a, b) => a.pricePerHour - b.pricePerHour)
            } else if (filters.sortBy === "Price: High to Low") {
                result.sort((a, b) => b.pricePerHour - a.pricePerHour)
            } else if (filters.sortBy === "Rating") {
                result.sort((a, b) => b.rating - a.rating)
            }
        }

        return result
    }, [allParkings, filters])
    const { user } = useAuthStore()
    const { toast } = useToast()
    const [favoriteIds, setFavoriteIds] = React.useState<Set<string>>(new Set())

    React.useEffect(() => {
        if (!user) return
        const load = async () => {
            const { data } = await supabase
                .from("favorites")
                .select("parking_id")
                .eq("user_id", user.id)
            if (data) setFavoriteIds(new Set(data.map((f) => f.parking_id)))
        }
        load()
    }, [user])

    const toggleFavorite = async (parkingId: string) => {
        if (!user) {
            toast({ title: "Please log in", description: "You need to be logged in to add favorites", variant: "destructive" })
            return
        }
        if (favoriteIds.has(parkingId)) {
            await supabase.from("favorites").delete().eq("user_id", user.id).eq("parking_id", parkingId)
            setFavoriteIds((prev) => { const n = new Set(prev); n.delete(parkingId); return n })
            toast({ title: t.common.success, description: "Removed from favorites" })
        } else {
            const { error } = await supabase.from("favorites").insert({ user_id: user.id, parking_id: parkingId })
            if (!error) {
                setFavoriteIds((prev) => new Set(prev).add(parkingId))
                toast({ title: t.common.success, description: "Added to favorites!" })
            }
        }
    }

    const getAmenityIcon = (type: string) => {
        switch (type) {
            case "ev": return <Zap className="h-3 w-3" />
            case "cctv": return <Shield className="h-3 w-3" />
            case "covered": return <Car className="h-3 w-3" />
            case "24h": return <Clock className="h-3 w-3" />
            default: return null
        }
    }

    if (parkings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Car className="h-12 w-12 mb-4 opacity-40" />
                <p className="text-lg font-medium">No parkings available yet</p>
                <p className="text-sm">Check back later or try different filters.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {parkings.map((parking, index) => (
                <motion.div
                    key={parking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative rounded-2xl glass overflow-hidden card-hover"
                >
                    {/* Image Placeholder */}
                    <div className="relative h-48 bg-secondary/50 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-secondary to-background">
                            <Car className="h-12 w-12 opacity-20" />
                        </div>

                        {/* Overlay badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-md ${parking.availableSpots > 10 ? "bg-green-500/20 text-green-500" : "bg-orange-500/20 text-orange-500"
                                }`}>
                                {parking.availableSpots} spots left
                            </span>
                        </div>

                        <button
                            className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors text-white"
                            onClick={(e) => { e.preventDefault(); toggleFavorite(parking.id) }}
                        >
                            <Heart className={`h-4 w-4 ${favoriteIds.has(parking.id) ? "fill-red-500 text-red-500" : ""}`} />
                        </button>
                    </div>

                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {parking.name}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {parking.address}, {parking.city}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-lg text-primary">${parking.pricePerHour.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground">/hour</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 my-4">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-medium">{parking.rating}</span>
                                <span className="text-xs text-muted-foreground">(24)</span>
                            </div>
                            <div className="flex gap-1">
                                {parking.amenities.map((amenity) => (
                                    <div
                                        key={amenity}
                                        className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center text-muted-foreground"
                                        title={amenity}
                                    >
                                        {getAmenityIcon(amenity)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                            <Link href={`/booking/${parking.id}`} className="w-full">
                                <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    Book Now
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
