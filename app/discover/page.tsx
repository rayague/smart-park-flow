"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ParkingFilters, type FilterState } from "@/components/discover/parking-filters"
import { ParkingList } from "@/components/discover/parking-list"
import { useParkingStore } from "@/lib/store"

export default function DiscoverPage() {
    const { t } = useTranslation()
    const { fetchParkings } = useParkingStore()

    const [filters, setFilters] = React.useState<FilterState>({
        location: "",
        priceRange: [0, 50],
        amenities: new Set(),
        sortBy: "",
    })

    React.useEffect(() => {
        fetchParkings()
    }, [fetchParkings])

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-24">
                <div className="max-w-7xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
                            {t.nav.parkings}
                        </h1>
                        <p className="text-muted-foreground max-w-2xl text-lg">
                            Find the perfect parking spot from our network of secure and convenient locations.
                        </p>
                    </motion.div>

                    <ParkingFilters filters={filters} onFiltersChange={setFilters} />
                    <ParkingList filters={filters} />
                </div>
            </main>

            <Footer />
        </div>
    )
}
