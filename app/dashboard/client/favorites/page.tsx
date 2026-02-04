"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MapPin, Star, ArrowRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

export default function ClientFavoritesPage() {
    const { t } = useTranslation()

    const favorites = [
        {
            id: "1",
            name: "Central Station Parking",
            location: "Downtown, 1.2km away",
            rating: 4.8,
            image: "/images/parking-1.jpg",
        },
        {
            id: "3",
            name: "Tech Hub EV Center",
            location: "Business Park, 0.8km away",
            rating: 4.9,
            image: "/images/parking-3.jpg",
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-3xl font-bold">{t.userDashboard.navigation.favorites}</h1>
                <p className="text-muted-foreground">Your saved parking locations for quick access</p>
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

                        <div className="h-40 bg-secondary/50 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <MapPin className="h-10 w-10 opacity-20" />
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
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-secondary/20 p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
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
