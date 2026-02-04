"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Filter,
    MapPin,
    Zap,
    Shield,
    Car,
    Clock,
    SlidersHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function ParkingFilters() {
    const { t } = useTranslation()
    const [priceRange, setPriceRange] = React.useState([0, 20])
    const [showFilters, setShowFilters] = React.useState(false)

    const amenities = [
        { icon: Zap, label: "EV Charging" },
        { icon: Shield, label: "24/7 Security" },
        { icon: Car, label: "Covered Parking" },
        { icon: Clock, label: "24h Access" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={t.common.location}
                        className="pl-10 h-12 bg-secondary/50 border-0"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                        "gap-2 h-12 px-6",
                        showFilters && "bg-primary/10 text-primary border-primary/50"
                    )}
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            <motion.div
                initial={false}
                animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
                className="overflow-hidden"
            >
                <div className="rounded-2xl glass p-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Price Range */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Price Range ($/hr)</label>
                            <span className="text-sm text-muted-foreground">
                                ${priceRange[0]} - ${priceRange[1]}
                            </span>
                        </div>
                        <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={50}
                            step={1}
                            className="py-4"
                        />
                    </div>

                    {/* Amenities */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Amenities</label>
                        <div className="grid grid-cols-2 gap-3">
                            {amenities.map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <Switch id={item.label} />
                                    <label
                                        htmlFor={item.label}
                                        className="text-sm text-muted-foreground cursor-pointer select-none"
                                    >
                                        {item.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Sort By</label>
                        <div className="flex flex-wrap gap-2">
                            {["Distance", "Price: Low to High", "Rating"].map((sort) => (
                                <button
                                    key={sort}
                                    className="px-3 py-1.5 rounded-lg text-sm bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {sort}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
