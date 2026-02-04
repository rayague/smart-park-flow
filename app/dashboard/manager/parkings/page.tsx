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
    EditPadding,
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

// Mock parkings data
const parkings = [
    {
        id: "1",
        name: "Central Plazza Parking",
        address: "123 Rue de la Paix, Paris",
        totalSpots: 150,
        occupiedSpots: 84,
        evSpots: 20,
        price: 3.50,
        status: "active",
        revenue: 12450.80
    },
    {
        id: "2",
        name: "Riviera Smart Park",
        address: "45 Promenade des Anglais, Nice",
        totalSpots: 200,
        occupiedSpots: 120,
        evSpots: 45,
        price: 4.20,
        status: "active",
        revenue: 18900.50
    },
    {
        id: "3",
        name: "Underground Station",
        address: "8 Place de la Comédie, Montpellier",
        totalSpots: 100,
        occupiedSpots: 10,
        evSpots: 10,
        price: 2.80,
        status: "maintenance",
        revenue: 5600.00
    },
    {
        id: "4",
        name: "Airport Premium",
        address: "Terminal 1, Orly",
        totalSpots: 500,
        occupiedSpots: 430,
        evSpots: 100,
        price: 6.50,
        status: "active",
        revenue: 45200.00
    }
]

export default function ManagerParkingsPage() {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = React.useState("")

    const filteredParkings = parkings.filter(p =>
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
                {filteredParkings.map((parking, index) => (
                    <motion.div
                        key={parking.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="group relative overflow-hidden rounded-2xl glass p-6 card-hover"
                    >
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            {/* Parking Icon/Thumbnail Placeholder */}
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {parking.address}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Zap className="h-3.5 w-3.5 text-blue-500" />
                                        {parking.evSpots} EV Spots
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex gap-8 sm:border-x sm:border-border/50 sm:px-8">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Occupancy</p>
                                    <p className="text-lg font-bold">
                                        {Math.round((parking.occupiedSpots / parking.totalSpots) * 100)}%
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Revenue</p>
                                    <p className="text-lg font-bold">
                                        €{parking.revenue.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
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
                                            <EditPadding className="h-4 w-4" /> Edit
                                        </DropdownMenuItem>
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

                        {/* Progress Bar for occupancy */}
                        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-secondary">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(parking.occupiedSpots / parking.totalSpots) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                className={`h-full ${(parking.occupiedSpots / parking.totalSpots) > 0.9
                                        ? "bg-red-500"
                                        : (parking.occupiedSpots / parking.totalSpots) > 0.7
                                            ? "bg-yellow-500"
                                            : "bg-primary"
                                    }`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
