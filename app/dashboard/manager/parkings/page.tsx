"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus,
    Search,
    MoreHorizontal,
    MapPin,
    Car,
    Zap,
    ExternalLink,
    Edit,
    Trash2,
    Eye,
    Filter,
    LayoutGrid
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n"
import { useParkingStore, useReservationStore } from "@/lib/store"
import { AddParkingModal } from "@/components/manager/add-parking-modal"
import { EditParkingModal } from "@/components/manager/edit-parking-modal"
import { MapModal } from "@/components/manager/map-modal"
import { Parking } from "@/lib/store"

export default function ManagerParkingsPage() {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [showAddModal, setShowAddModal] = React.useState(false)
    const [editingParking, setEditingParking] = React.useState<Parking | null>(null)
    const [mapParking, setMapParking] = React.useState<Parking | null>(null)
    const [sortBy, setSortBy] = React.useState<"name" | "occupancy" | "revenue">("name")

    const { parkings, fetchParkings } = useParkingStore()
    const { reservations, fetchReservations } = useReservationStore()

    React.useEffect(() => {
        fetchParkings()
        fetchReservations()
    }, [fetchParkings, fetchReservations])

    const sortedParkings = React.useMemo(() => {
        console.log("Recomputing sorted parkings with sortBy:", sortBy)

        // Filter first
        const filtered = parkings.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.address.toLowerCase().includes(searchQuery.toLowerCase())
        )

        // Then sort
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name)
            }
            if (sortBy === "occupancy") {
                const occA = a.totalSpots > 0 ? (a.totalSpots - a.availableSpots) / a.totalSpots : 0
                const occB = b.totalSpots > 0 ? (b.totalSpots - b.availableSpots) / b.totalSpots : 0
                return occB - occA // More occupied first
            }
            if (sortBy === "revenue") {
                const revA = reservations.filter(r => r.parkingId === a.id).reduce((acc, r) => acc + r.totalPrice, 0)
                const revB = reservations.filter(r => r.parkingId === b.id).reduce((acc, r) => acc + r.totalPrice, 0)
                return revB - revA // Highest revenue first
            }
            return 0
        })
        console.log("Sorted order (len:", sorted.length, "):", sorted.map(p => p.name))
        return sorted
    }, [parkings, searchQuery, sortBy, reservations])

    return (
        <>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                            {t.managerDashboard.navigation.parkings}
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your parking installations and monitor their performance.
                        </p>
                    </div>
                    <Button
                        className="gap-2"
                        onClick={() => {
                            console.log("Add Parking button clicked")
                            setShowAddModal(true)
                        }}
                    >
                        <Plus className="h-4 w-4" />
                        Add Parking
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search parkings..."
                            className="pl-9 glass"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="glass gap-2 min-w-[160px] h-10 border-white/10"
                        onClick={() => {
                            setSortBy(prev => {
                                if (prev === "name") return "revenue"
                                if (prev === "revenue") return "occupancy"
                                return "name"
                            })
                        }}
                    >
                        <Filter className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                            {sortBy === "name" ? "Tri : Nom A-Z" : sortBy === "occupancy" ? "Tri : Occupation" : "Tri : Revenus"}
                        </span>
                    </Button>
                </motion.div>

                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>{sortedParkings.length} parking(s) trouvé(s)</span>
                    <span className="italic">Tri : {sortBy}</span>
                </div>

                <div className="grid gap-6">
                    <AnimatePresence mode="popLayout">
                        {sortedParkings.map((parking, index) => (
                            <motion.div
                                layout
                                key={parking.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="group relative overflow-hidden rounded-2xl glass p-6 card-hover"
                            >
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                    {/* Parking Icon/Thumbnail Placeholder */}
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-box text-primary">
                                        <Car className="h-8 w-8" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-serif text-xl font-bold">{parking.name}</h3>
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${parking.status === "active"
                                                ? "bg-green-500/10 text-green-500"
                                                : "bg-yellow-500/10 text-yellow-500"
                                                }`}>
                                                {parking.status}
                                            </span>
                                            {sortBy !== "name" && (
                                                <Badge variant="outline" className="ml-2 bg-primary/5 border-primary/20 text-primary">
                                                    {sortBy === "occupancy"
                                                        ? `${Math.round((parking.totalSpots - parking.availableSpots) / parking.totalSpots * 100)}% Occ.`
                                                        : `€${reservations.filter(r => r.parkingId === parking.id).reduce((acc, r) => acc + r.totalPrice, 0)} Rev.`
                                                    }
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {parking.address}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Zap className="h-3.5 w-3.5 text-blue-500" />
                                                {parking.hasEvCharging ? "EV" : "No EV"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="flex gap-6 sm:border-x sm:border-border/50 sm:px-6">
                                        <div className="text-center min-w-[80px]">
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Occupancy</p>
                                            <p className="text-lg font-bold">
                                                {parking.totalSpots > 0
                                                    ? Math.round(((parking.totalSpots - parking.availableSpots) / parking.totalSpots) * 100)
                                                    : 0}%
                                            </p>
                                        </div>
                                        <div className="text-center min-w-[80px]">
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Total Earned</p>
                                            <p className="text-lg font-bold">
                                                €{((parking.totalSpots - parking.availableSpots) * parking.pricePerHour).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-center min-w-[80px]">
                                            <p className="text-[10px] text-primary uppercase tracking-widest mb-1">Live Hourly</p>
                                            <p className="text-lg font-bold text-primary">
                                                €{(parking.totalSpots - parking.availableSpots) * parking.pricePerHour}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <Button asChild variant="outline" size="sm" className="glass gap-2 border-primary/20 hover:bg-primary/10">
                                            <Link href={`/dashboard/manager/spots?parkingId=${parking.id}`}>
                                                <LayoutGrid className="h-4 w-4" />
                                                <span>Manage</span>
                                            </Link>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="glass">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="glass">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="gap-2"
                                                    onClick={() => setEditingParking(parking)}
                                                >
                                                    <Edit className="h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="gap-2"
                                                    onClick={() => setMapParking(parking)}
                                                >
                                                    <ExternalLink className="h-4 w-4" /> View Map
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Progress Bar for occupancy */}
                                <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-secondary">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${parking.totalSpots > 0
                                                ? ((parking.totalSpots - parking.availableSpots) / parking.totalSpots) * 100
                                                : 0}%`,
                                        }}
                                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                        className={`h-full ${parking.totalSpots > 0 && ((parking.totalSpots - parking.availableSpots) / parking.totalSpots) > 0.9
                                            ? "bg-red-500"
                                            : parking.totalSpots > 0 && ((parking.totalSpots - parking.availableSpots) / parking.totalSpots) > 0.7
                                                ? "bg-yellow-500"
                                                : "bg-primary"
                                            }`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {sortedParkings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground glass rounded-2xl border-dashed border-2">
                        <Car className="h-12 w-12 mb-4 opacity-20" />
                        <p>Aucun parking trouvé.</p>
                    </div>
                )}
            </div>

            <AddParkingModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
            />

            <EditParkingModal
                parking={editingParking}
                onClose={() => setEditingParking(null)}
            />

            <MapModal
                parking={mapParking}
                onClose={() => setMapParking(null)}
            />
        </>
    )
}
