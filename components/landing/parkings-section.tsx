"use client"

import * as React from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Star, MapPin, Zap, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

function ParkingCard({ 
  parking, 
  index 
}: { 
  parking: {
    id: string
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    totalSpots: number
    availableSpots: number
    pricePerHour: number
    hasEvCharging: boolean
    rating: number
    images: string[]
    amenities: string[]
  }
  index: number 
}) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const availabilityPercent = (parking.availableSpots / parking.totalSpots) * 100

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative h-full overflow-hidden rounded-2xl glass card-hover">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={parking.images[0] || "/placeholder.svg"}
            alt={parking.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {parking.hasEvCharging && (
              <Badge className="bg-accent text-accent-foreground gap-1">
                <Zap className="h-3 w-3" />
                EV
              </Badge>
            )}
            <Badge 
              variant="secondary" 
              className={cn(
                "gap-1",
                availabilityPercent < 20 ? "bg-destructive text-destructive-foreground" :
                availabilityPercent < 50 ? "bg-yellow-500/20 text-yellow-500" :
                "bg-accent/20 text-accent"
              )}
            >
              {parking.availableSpots} spots
            </Badge>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-sm font-medium backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {parking.rating}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="mb-1 font-serif text-lg font-semibold line-clamp-1">
            {parking.name}
          </h3>
          
          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{parking.address}, {parking.city}</span>
          </div>

          {/* Amenities */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {parking.amenities.slice(0, 3).map((amenity) => (
              <span 
                key={amenity}
                className="rounded-full bg-subtle px-2 py-0.5 text-xs text-muted-foreground"
              >
                {amenity}
              </span>
            ))}
            {parking.amenities.length > 3 && (
              <span className="rounded-full bg-subtle px-2 py-0.5 text-xs text-muted-foreground">
                +{parking.amenities.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">
                {parking.pricePerHour.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">/hour</span>
            </div>
            
            <Button size="sm" className="gap-1 group/btn">
              Book Now
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </div>

        {/* Availability Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${availabilityPercent}%` } : {}}
            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            className={cn(
              "h-full",
              availabilityPercent < 20 ? "bg-destructive" :
              availabilityPercent < 50 ? "bg-yellow-500" :
              "bg-accent"
            )}
          />
        </div>
      </div>
    </motion.div>
  )
}

export function ParkingsSection() {
  const titleRef = React.useRef(null)
  const isTitleInView = useInView(titleRef, { once: true })

  const [parkings, setParkings] = React.useState<
    Array<{
      id: string
      name: string
      address: string
      city: string
      latitude: number
      longitude: number
      totalSpots: number
      availableSpots: number
      pricePerHour: number
      hasEvCharging: boolean
      rating: number
      images: string[]
      amenities: string[]
    }>
  >([])

  React.useEffect(() => {
    let cancelled = false

    ;(async () => {
      const { data, error } = await supabase
        .from('parkings')
        .select('*')
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false })
        .limit(6)

      if (cancelled) return
      if (error) {
        console.error('Failed to load parkings:', error)
        setParkings([])
        return
      }

      setParkings(
        (data || []).map((p) => ({
          id: p.id,
          name: p.name,
          address: p.address,
          city: p.city,
          latitude: p.latitude ?? 0,
          longitude: p.longitude ?? 0,
          totalSpots: p.total_spots,
          availableSpots: p.available_spots,
          pricePerHour: p.price_per_hour,
          hasEvCharging: !!p.has_ev_charging,
          rating: p.rating ?? 0,
          images: p.images ?? [],
          amenities: p.amenities ?? [],
        }))
      )
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="parkings" className="relative py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isTitleInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Parkings</span>
          </motion.div>
          
          <h2 className="mb-4 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl text-balance">
            Discover <span className="text-gradient-primary">premium parkings</span> near you
          </h2>
          
          <p className="text-lg text-muted-foreground">
            From city centers to airports, find the perfect spot for your vehicle 
            with real-time availability updates.
          </p>
        </motion.div>

        {/* Parkings Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {parkings.map((parking, index) => (
            <ParkingCard key={parking.id} parking={parking} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Button size="lg" variant="outline" className="gap-2 glass bg-transparent">
            View All Parkings
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
