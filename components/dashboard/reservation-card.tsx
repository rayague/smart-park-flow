"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Car, 
  Zap, 
  MoreVertical,
  Navigation,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Reservation } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ReservationCardProps {
  reservation: Reservation
  onCancel?: (id: string) => void
  onNavigate?: (id: string) => void
  delay?: number
}

export function ReservationCard({
  reservation,
  onCancel,
  onNavigate,
  delay = 0,
}: ReservationCardProps) {
  const startTime = new Date(reservation.startTime)
  const endTime = new Date(reservation.endTime)
  const now = new Date()
  
  const isActive = reservation.status === "active" && startTime <= now && endTime >= now
  const isPending = reservation.status === "pending" || (reservation.status === "active" && startTime > now)
  
  const totalMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)
  const elapsedMinutes = Math.max(0, (now.getTime() - startTime.getTime()) / (1000 * 60))
  const progress = isActive ? Math.min((elapsedMinutes / totalMinutes) * 100, 100) : 0

  const statusColor = {
    pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    active: "bg-accent/20 text-accent border-accent/30",
    completed: "bg-muted text-muted-foreground border-border",
    cancelled: "bg-destructive/20 text-destructive border-destructive/30",
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative overflow-hidden rounded-2xl glass p-5 card-hover"
    >
      {/* Status Badge */}
      <div className="mb-4 flex items-center justify-between">
        <Badge
          variant="outline"
          className={cn("capitalize", statusColor[reservation.status])}
        >
          {reservation.status}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(isPending || isActive) && (
              <DropdownMenuItem onClick={() => onNavigate?.(reservation.id)}>
                <Navigation className="mr-2 h-4 w-4" />
                Navigate
              </DropdownMenuItem>
            )}
            {(isPending || isActive) && (
              <DropdownMenuItem
                onClick={() => onCancel?.(reservation.id)}
                className="text-destructive focus:text-destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Reservation
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Parking Info */}
      <div className="mb-4">
        <h3 className="font-semibold line-clamp-1">{reservation.parkingName}</h3>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          Spot {reservation.spotNumber}
        </p>
      </div>

      {/* Time Info */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(startTime)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {formatTime(startTime)} - {formatTime(endTime)}
          </span>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{reservation.vehiclePlate}</span>
        </div>
        {reservation.isEv && (
          <Badge variant="secondary" className="gap-1">
            <Zap className="h-3 w-3" />
            EV
          </Badge>
        )}
      </div>

      {/* Progress Bar (for active reservations) */}
      {isActive && (
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Time remaining</span>
            <span className="font-medium">
              {Math.round(totalMinutes - elapsedMinutes)} min
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </div>
      )}

      {/* Price */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="font-semibold">
          ${reservation.totalPrice.toFixed(2)}
        </span>
      </div>
    </motion.div>
  )
}
