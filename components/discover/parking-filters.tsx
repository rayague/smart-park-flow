"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
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

export interface FilterState {
    location: string
    priceRange: [number, number]
    amenities: Set<string>
    sortBy: string
}

interface ParkingFiltersProps {
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
}

const AMENITIES = [
    { key: "ev", icon: Zap, label: "EV Charging" },
    { key: "cctv", icon: Shield, label: "24/7 Security" },
    { key: "covered", icon: Car, label: "Covered Parking" },
    { key: "24h", icon: Clock, label: "24h Access" },
]

const SORT_OPTIONS = ["Price: Low to High", "Price: High to Low", "Rating"]

export function ParkingFilters({ filters, onFiltersChange }: ParkingFiltersProps) {
    const { t } = useTranslation()
    const [showFilters, setShowFilters] = React.useState(false)

    const updateLocation = (val: string) => {
        onFiltersChange({ ...filters, location: val })
    }

    const updatePrice = (val: number[]) => {
        onFiltersChange({ ...filters, priceRange: [val[0], val[1]] })
    }

    const toggleAmenity = (key: string) => {
        const next = new Set(filters.amenities)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        onFiltersChange({ ...filters, amenities: next })
    }

    const setSort = (sort: string) => {
        onFiltersChange({ ...filters, sortBy: filters.sortBy === sort ? "" : sort })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={t.common.location}
                        className="pl-10 h-12 bg-secondary/50 border-0"
                        value={filters.location}
                        onChange={(e) => updateLocation(e.target.value)}
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
                    {(filters.amenities.size > 0 || filters.sortBy) && (
                        <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {filters.amenities.size + (filters.sortBy ? 1 : 0)}
                        </span>
                    )}
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
                                ${filters.priceRange[0]} - ${filters.priceRange[1]}
                            </span>
                        </div>
                        <Slider
                            value={[filters.priceRange[0], filters.priceRange[1]]}
                            onValueChange={updatePrice}
                            max={50}
                            step={1}
                            className="py-4"
                        />
                    </div>

                    {/* Amenities */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Amenities</label>
                        <div className="grid grid-cols-2 gap-3">
                            {AMENITIES.map((item) => (
                                <div key={item.key} className="flex items-center gap-2">
                                    <Switch
                                        id={item.key}
                                        checked={filters.amenities.has(item.key)}
                                        onCheckedChange={() => toggleAmenity(item.key)}
                                    />
                                    <label
                                        htmlFor={item.key}
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
                            {SORT_OPTIONS.map((sort) => (
                                <button
                                    key={sort}
                                    onClick={() => setSort(sort)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-sm transition-colors",
                                        filters.sortBy === sort
                                            ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                                            : "bg-secondary/50 hover:bg-primary/10 hover:text-primary"
                                    )}
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
