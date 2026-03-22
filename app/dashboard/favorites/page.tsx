"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MapPin, Star, ArrowRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { useAuthStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"

export default function FavoritesPage() {
    const { t } = useTranslation()

    const { user } = useAuthStore()
    const [favorites, setFavorites] = React.useState<
        Array<{
            id: string
            parkingId: string
            name: string
            location: string
            rating: number
            image: string | null
        }>
    >([])

    React.useEffect(() => {
        if (!user) return

        let cancelled = false
        ;(async () => {
            const { data, error } = await supabase
                .from('favorites')
                .select('id, parking_id, parkings:parkings(*)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (cancelled) return
            if (error) {
                console.error('Failed to load favorites:', error)
                setFavorites([])
                return
            }

            const mapped = (data || []).map((f: any) => {
                const p = f.parkings
                return {
                    id: f.id,
                    parkingId: f.parking_id,
                    name: p?.name || 'Parking',
                    location: `${p?.city || ''}${p?.address ? `, ${p.address}` : ''}`,
                    rating: p?.rating ?? 0,
                    image: (p?.images && p.images[0]) || null,
                }
            })

            setFavorites(mapped)
        })()

        return () => {
            cancelled = true
        }
    }, [user])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-black tracking-tighter uppercase">{t.userDashboard.navigation.favorites}</h1>
                <p className="text-muted-foreground">{t.userDashboard.favorites.subtitle}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map((parking, index) => (
                    <motion.div
                        key={parking.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative overflow-hidden rounded-2xl glass card-hover"
                    >
                        <div className="absolute top-3 right-3 z-10">
                            <Button variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md hover:bg-destructive hover:text-white text-white">
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

                                <Link href={`/booking/${parking.parkingId}`}>
                                    <Button size="sm" className="gap-2 font-bold uppercase tracking-tight">
                                        {t.common.bookNow}
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {favorites.length === 0 && (
                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl glass p-10 text-center text-muted-foreground font-medium">
                        {t.userDashboard.favorites.empty}
                    </div>
                )}

                {/* Add New Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-subtle p-6 text-center hover:border-primary/50 hover:bg-icon-box transition-all cursor-pointer"
                >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-icon-box">
                        <Star className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold text-lg uppercase tracking-tight">{t.userDashboard.favorites.addTitle}</h3>
                    <p className="mt-2 text-sm text-muted-foreground mb-4">
                        {t.userDashboard.favorites.addSubtitle}
                    </p>
                    <Link href="/discover">
                        <Button variant="outline" className="font-bold uppercase tracking-tight">{t.userDashboard.favorites.browseButton}</Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
