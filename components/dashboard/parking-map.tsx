"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MapPin, Star, Zap, Navigation, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Parking } from "@/lib/store"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ParkingMapProps {
  parkings?: Parking[]
  onSelectParking?: (parking: Parking) => void
  selectedParking?: Parking | null
  className?: string
}

export function ParkingMap({ 
  parkings = [],
  onSelectParking, 
  selectedParking,
  className 
}: ParkingMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const [userLocation, setUserLocation] = React.useState({ lat: 48.8566, lng: 2.3522 })

  // Simulated marker positions based on parking data
  const markers = React.useMemo(() => {
    return parkings.map((parking) => ({
      ...parking,
      x: ((parking.longitude - 2.2) / 0.2) * 100,
      y: ((48.9 - parking.latitude) / 0.05) * 100,
    }))
  }, [parkings])

  return (
    <div className={cn("relative overflow-hidden rounded-2xl glass", className)}>
      {/* Map Container */}
      <div
        ref={mapRef}
        className="relative h-full w-full bg-gradient-to-br from-secondary/50 to-secondary"
        style={{ minHeight: 400 }}
      >
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Simulated Map Roads */}
        <svg className="absolute inset-0 h-full w-full opacity-20">
          <defs>
            <pattern
              id="roads"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 50 H100 M50 0 V100"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#roads)" />
        </svg>

        {/* User Location */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg glow-primary">
              <Navigation className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Parking Markers */}
        {markers.map((parking, index) => {
          const isSelected = selectedParking?.id === parking.id
          const availabilityPercent = (parking.availableSpots / parking.totalSpots) * 100

          return (
            <motion.button
              key={parking.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectParking?.(parking)}
              className={cn(
                "absolute z-10 transition-transform hover:scale-110",
                isSelected && "z-30 scale-110"
              )}
              style={{
                left: `${Math.min(Math.max(parking.x, 10), 90)}%`,
                top: `${Math.min(Math.max(parking.y, 10), 90)}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative">
                {/* Pulse effect for available spots */}
                {availabilityPercent > 20 && (
                  <div
                    className={cn(
                      "absolute inset-0 animate-ping rounded-full",
                      availabilityPercent > 50 ? "bg-accent/30" : "bg-yellow-500/30"
                    )}
                  />
                )}
                
                <div
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all",
                    isSelected
                      ? "bg-primary ring-4 ring-primary/30"
                      : availabilityPercent < 20
                      ? "bg-destructive"
                      : availabilityPercent < 50
                      ? "bg-yellow-500"
                      : "bg-accent"
                  )}
                >
                  <MapPin className="h-5 w-5 text-white" />
                </div>

                {/* Price Tag */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-card px-2 py-0.5 text-xs font-medium shadow-md">
                  ${parking.pricePerHour}/h
                </div>
              </div>
            </motion.button>
          )
        })}

        {/* Selected Parking Panel */}
        {selectedParking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 z-40 overflow-hidden rounded-xl bg-card/95 shadow-xl backdrop-blur-sm md:left-auto md:w-80"
          >
            <div className="relative h-32">
              <Image
                src={selectedParking.images[0] || "/placeholder.svg"}
                alt={selectedParking.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSelectParking?.(null as unknown as Parking)}
                className="absolute right-2 top-2 h-8 w-8 bg-card/80"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold line-clamp-1">
                    {selectedParking.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {selectedParking.address}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {selectedParking.rating}
                </div>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {selectedParking.availableSpots} spots
                </Badge>
                {selectedParking.hasEvCharging && (
                  <Badge variant="secondary" className="gap-1">
                    <Zap className="h-3 w-3" />
                    EV
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    ${selectedParking.pricePerHour.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">/hour</span>
                </div>
                <Button className="glow-primary-sm">Book Now</Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <Button size="icon" variant="secondary" className="h-10 w-10 bg-card/90">
          <span className="text-lg font-bold">+</span>
        </Button>
        <Button size="icon" variant="secondary" className="h-10 w-10 bg-card/90">
          <span className="text-lg font-bold">-</span>
        </Button>
        <Button size="icon" variant="secondary" className="h-10 w-10 bg-card/90">
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 hidden rounded-lg bg-card/90 p-3 backdrop-blur-sm md:block">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Availability
        </p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  )
}
