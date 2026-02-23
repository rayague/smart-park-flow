"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Plus,
    Search,
    MoreHorizontal,
    MapPin,
    Car,
    Zap,
    ExternalLink,
    Trash2,
    Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n"


import { useParkingStore } from "@/lib/store"

export default function ProprietaireParkingsPage() {
    const { t } = useTranslation()
    const { parkings, fetchParkings } = useParkingStore()
    const [searchQuery, setSearchQuery] = React.useState("")

    React.useEffect(() => {
        fetchParkings()
    }, [fetchParkings])

    const filteredParkings = (parkings || []).filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
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
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Parking
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
                <Button variant="outline" className="glass">
                    Filter
                </Button>
            </motion.div>

            <div className="grid gap-6">
                {filteredParkings.map((parking, index) => {
                    const occupiedSpots = parking.totalSpots - parking.availableSpots;
                    const occupancyRate = (occupiedSpots / parking.totalSpots) * 100;

                    return (
                        <motion.div
                            key={parking.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl glass p-6 card-hover"
                        >
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-box text-primary">
                                    <Car className="h-8 w-8" />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-serif text-xl font-bold">{parking.name}</h3>
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${parking.status === "active"
                                            ? "bg-green-500/10 text-green-500"
                                            : "bg-yellow-500/10 text-yellow-500"
                                            }`}>
                                            {parking.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {parking.address}, {parking.city}
                                        </div>
                                        {parking.hasEvCharging && (
                                            <div className="flex items-center gap-1">
                                                <Zap className="h-3.5 w-3.5 text-blue-500" />
                                                EV Supported
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-8 sm:border-x sm:border-border/50 sm:px-8">
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Occupancy</p>
                                        <p className="text-lg font-bold">
                                            {Math.round(occupancyRate)}%
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Price</p>
                                        <p className="text-lg font-bold">
                                            €{parking.pricePerHour}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="glass">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="glass">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="glass">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="gap-2">
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

                            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-secondary">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${occupancyRate}%` }}
                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                    className={`h-full ${occupancyRate > 90
                                        ? "bg-red-500"
                                        : occupancyRate > 70
                                            ? "bg-yellow-500"
                                            : "bg-primary"
                                        }`}
                                />
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
