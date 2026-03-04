"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MapPin, ExternalLink, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Parking } from "@/lib/store"

interface MapModalProps {
    parking: Parking | null
    onClose: () => void
}

export function MapModal({ parking, onClose }: MapModalProps) {
    if (!parking) return null

    // Helper to generate Google Maps search URL
    const encodedAddress = encodeURIComponent(`${parking.name}, ${parking.address}, ${parking.city}`)
    const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    const externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`

    return (
        <AnimatePresence>
            {parking && (
                <motion.div
                    key="backdrop"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Card */}
                    <motion.div
                        key="card"
                        initial={{ opacity: 0, scale: 0.94, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 24 }}
                        transition={{ type: "spring", damping: 20, stiffness: 280 }}
                        className="relative z-10 flex h-full max-h-[800px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-background/80 shadow-2xl backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 bg-background/40">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="font-serif text-lg font-bold truncate">{parking.name}</h2>
                                    <p className="text-xs text-muted-foreground truncate">{parking.address}, {parking.city}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hidden sm:flex gap-2 glass border-white/10"
                                    onClick={() => window.open(externalUrl, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Google Maps
                                </Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white/5" onClick={onClose}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="relative flex-1 bg-secondary/20">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={embedUrl}
                                allowFullScreen
                                loading="lazy"
                                className="grayscale-[0.2] invert-[0.05] contrast-[1.1]"
                            />

                            {/* Overlay Controls */}
                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                <div className="rounded-xl glass p-3 border border-white/10 shadow-lg flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                                        <Navigation className="h-4 w-4" />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-semibold text-white">Location precise</p>
                                        <p className="text-muted-foreground">Coordinates: {parking.latitude.toFixed(4)}, {parking.longitude.toFixed(4)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer (Mobile only primary action) */}
                        <div className="sm:hidden border-t border-white/5 p-4 bg-background/40">
                            <Button
                                className="w-full h-12 gap-2 glow-primary bg-gradient-to-r from-primary to-accent"
                                onClick={() => window.open(externalUrl, '_blank')}
                            >
                                <ExternalLink className="h-4 w-4" />
                                Ouvrir dans Google Maps
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
