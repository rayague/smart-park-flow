"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MapPin, Star, ArrowRight, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { useAuthStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface FavoriteParking {
    id: string
    favoriteId: string
    name: string
    location: string
    rating: number
}

export default function ClientFavoritesPage() {
    const { t } = useTranslation()
    const { user } = useAuthStore()
    const { toast } = useToast()
    const [favorites, setFavorites] = React.useState<FavoriteParking[]>([])
    const [loading, setLoading] = React.useState(true)

    const fetchFavorites = React.useCallback(async () => {
        if (!user) return
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("favorites")
                .select("id, parking_id, parkings(id, name, address, city, rating)")
                .eq("user_id", user.id)

            if (error) throw error

            const mapped = (data || []).map((f: any) => ({
                id: f.parkings?.id || f.parking_id,
                favoriteId: f.id,
                name: f.parkings?.name || "Parking",
                location: `${f.parkings?.address || ""}, ${f.parkings?.city || ""}`,
                rating: f.parkings?.rating ?? 0,
            }))
            setFavorites(mapped)
        } catch (e) {
            console.error("Failed to fetch favorites:", e)
        } finally {
            setLoading(false)
        }
    }, [user])

    React.useEffect(() => {
        fetchFavorites()
    }, [fetchFavorites])

    const removeFavorite = async (favoriteId: string) => {
        try {
            const { error } = await supabase.from("favorites").delete().eq("id", favoriteId)
            if (error) throw error
            setFavorites((prev) => prev.filter((f) => f.favoriteId !== favoriteId))
            toast({ title: t.common.success, description: "Removed from favorites" })
        } catch (e: any) {
            toast({ title: t.common.error, description: e.message, variant: "destructive" })
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-3xl font-bold">{t.userDashboard.navigation.favorites}</h1>
                <p className="text-muted-foreground">Your saved parking locations for quick access</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading && (
                    <div className="col-span-full flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!loading && favorites.map((parking, index) => (
                    <motion.div
                        key={parking.favoriteId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative overflow-hidden rounded-2xl glass card-hover"
                    >
                        <div className="absolute top-3 right-3 z-10">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-black/20 backdrop-blur-md hover:bg-destructive hover:text-white text-white"
                                onClick={() => removeFavorite(parking.favoriteId)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="h-40 bg-subtle relative">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <MapPin className="h-10 w-10 opacity-40" />
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {parking.name}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {parking.location}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-sm">
                                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    <span className="font-medium">{parking.rating}</span>
                                </div>

                                <Link href={`/booking/${parking.id}`}>
                                    <Button size="sm" className="gap-2">
                                        Book Now
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-subtle p-6 text-center hover:border-primary/50 hover:bg-icon-box transition-all cursor-pointer"
                >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-icon-box">
                        <Star className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">Add Favorites</h3>
                    <p className="mt-2 text-sm text-muted-foreground mb-4">
                        Browse parkings and save them here for faster booking.
                    </p>
                    <Link href="/discover">
                        <Button variant="outline">Browse Parkings</Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
