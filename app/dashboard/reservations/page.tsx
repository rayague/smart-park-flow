"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Car,
    MapPin,
    Clock,
    Calendar,
    MoreVertical,
    QrCode
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReservationsPage() {
    const { t } = useTranslation()

    // Mock data
    const reservations = {
        active: [
            {
                id: "1",
                parkingName: "Central Station Parking",
                location: "Downtown",
                spot: "A-15",
                date: "Today, Feb 4",
                time: "14:00 - 16:00",
                price: 12.50,
                status: "active"
            }
        ],
        upcoming: [
            {
                id: "2",
                parkingName: "Mall Plaza Garage",
                location: "Shopping District",
                spot: "B-08",
                date: "Tomorrow, Feb 5",
                time: "10:00 - 12:00",
                price: 8.00,
                status: "upcoming"
            }
        ],
        past: [
            {
                id: "3",
                parkingName: "Tech Hub EV Center",
                location: "Business Park",
                spot: "E-02",
                date: "Jan 28, 2024",
                time: "09:00 - 17:00",
                price: 45.00,
                status: "completed"
            }
        ]
    }

    const ReservationCard = ({ booking }: { booking: any }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl glass p-6 card-hover group"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Car className="h-8 w-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-serif text-lg font-bold">{booking.parkingName}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${booking.status === "active" ? "bg-green-500/10 text-green-500" :
                                    booking.status === "upcoming" ? "bg-blue-500/10 text-blue-500" :
                                        "bg-secondary text-muted-foreground"
                                }`}>
                                {booking.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {booking.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {booking.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {booking.time}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right mr-4">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-lg">${booking.price.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                        <QrCode className="h-4 w-4" />
                        Ticket
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-serif text-3xl font-bold">{t.userDashboard.navigation.reservations}</h1>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">History</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                    {reservations.active.map((booking) => (
                        <ReservationCard key={booking.id} booking={booking} />
                    ))}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
                    {reservations.upcoming.map((booking) => (
                        <ReservationCard key={booking.id} booking={booking} />
                    ))}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    {reservations.past.map((booking) => (
                        <ReservationCard key={booking.id} booking={booking} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    )
}
