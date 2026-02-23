"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  Zap, 
  Clock,
  Filter,
  X,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ParkingMap } from "@/components/dashboard/parking-map"
import { useParkingStore } from "@/lib/store"
import type { Parking } from "@/lib/store"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function MapPage() {
  const { parkings, fetchParkings, selectParking, selectedParking, searchQuery, setSearchQuery, filters, setFilters } = useParkingStore()
  const [showFilters, setShowFilters] = React.useState(false)
  const [priceRange, setPriceRange] = React.useState([0, 10])

  React.useEffect(() => {
    fetchParkings()
  }, [fetchParkings])

  const filteredParkings = React.useMemo(() => {
    return parkings.filter((parking) => {
      const matchesSearch = 
        parking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parking.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parking.city.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesEv = !filters.hasEv || parking.hasEvCharging
      const matchesPrice = 
        parking.pricePerHour >= priceRange[0] && 
        parking.pricePerHour <= priceRange[1]

      return matchesSearch && matchesEv && matchesPrice
    })
  }, [parkings, searchQuery, filters.hasEv, priceRange])

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex w-full flex-col gap-4 lg:w-96"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by location, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2",
              showFilters && "bg-primary text-primary-foreground"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 rounded-xl glass p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({ hasEv: false, amenities: [] })
                  setPriceRange([0, 10])
                }}
                className="h-8 text-xs"
              >
                Reset
              </Button>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>Price per hour</Label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={10}
                step={0.5}
                className="py-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* EV Charging */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="ev-filter"
                checked={filters.hasEv}
                onCheckedChange={(checked) => 
                  setFilters({ hasEv: checked as boolean })
                }
              />
              <Label htmlFor="ev-filter" className="flex items-center gap-2 cursor-pointer">
                <Zap className="h-4 w-4 text-accent" />
                EV Charging Available
              </Label>
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {["24/7 Security", "Covered", "Valet", "Car Wash"].map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="outline"
                    className={cn(
                      "cursor-pointer transition-colors",
                      filters.amenities?.includes(amenity) && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      const current = filters.amenities || []
                      const updated = current.includes(amenity)
                        ? current.filter((a) => a !== amenity)
                        : [...current, amenity]
                      setFilters({ amenities: updated })
                    }}
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filteredParkings.length}</span> parkings found
          </p>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            Sort by: Distance
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        {/* Parking List */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {filteredParkings.map((parking, index) => (
            <motion.button
              key={parking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => selectParking(parking)}
              className={cn(
                "w-full rounded-xl glass p-3 text-left transition-all card-hover",
                selectedParking?.id === parking.id && "ring-2 ring-primary"
              )}
            >
              <div className="flex gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={parking.images[0] || "/placeholder.svg"}
                    alt={parking.name}
                    fill
                    className="object-cover"
                  />
                  {parking.hasEvCharging && (
                    <div className="absolute bottom-1 left-1 rounded bg-accent/90 p-0.5">
                      <Zap className="h-3 w-3 text-accent-foreground" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between">
                    <h3 className="font-medium line-clamp-1">{parking.name}</h3>
                    <div className="flex items-center gap-0.5 text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {parking.rating}
                    </div>
                  </div>

                  <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground line-clamp-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {parking.address}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">
                        ${parking.pricePerHour}
                      </span>
                      <span className="text-xs text-muted-foreground">/hour</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        parking.availableSpots < 10 
                          ? "bg-destructive/20 text-destructive" 
                          : parking.availableSpots < 30
                          ? "bg-yellow-500/20 text-yellow-600"
                          : "bg-accent/20 text-accent"
                      )}
                    >
                      {parking.availableSpots} spots
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 overflow-hidden rounded-2xl"
      >
        <ParkingMap
          parkings={filteredParkings}
          onSelectParking={selectParking}
          selectedParking={selectedParking}
          className="h-full"
        />
      </motion.div>
    </div>
  )
}
