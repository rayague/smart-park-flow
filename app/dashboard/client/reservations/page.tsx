"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Car,
    MapPin,
    Clock,
    Calendar,
    MoreVertical,
    QrCode,
    XCircle,
    Copy,
    Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useReservationStore } from "@/lib/store"
import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import type { Reservation } from "@/lib/store"

export default function ClientReservationsPage() {
    const { t } = useTranslation()
    const { toast } = useToast()
    const { reservations, fetchReservations, cancelReservation } = useReservationStore()
    const [ticketOpen, setTicketOpen] = React.useState(false)
    const [selectedBooking, setSelectedBooking] = React.useState<Reservation | null>(null)
    const [copied, setCopied] = React.useState(false)

    React.useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    const grouped = React.useMemo(() => {
        const active = reservations.filter((r) => r.status === "active")
        const upcoming = reservations.filter((r) => r.status === "pending")
        const past = reservations.filter((r) => r.status === "completed" || r.status === "cancelled")

        return { active, upcoming, past }
    }, [reservations])

    const defaultTab = React.useMemo(() => {
        if (grouped.active.length > 0) return "active"
        if (grouped.upcoming.length > 0) return "upcoming"
        if (grouped.past.length > 0) return "past"
        return "active"
    }, [grouped])

    const handleShowTicket = (booking: Reservation) => {
        setSelectedBooking(booking)
        setTicketOpen(true)
    }

    const handleCancel = (booking: Reservation) => {
        cancelReservation(booking.id)
        toast({
            title: "Reservation cancelled",
            description: `Your reservation at ${booking.parkingName} has been cancelled.`,
        })
    }

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const ReservationCard = ({ booking, viewStatus }: { booking: Reservation; viewStatus: string }) => (
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
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${viewStatus === "active" ? "bg-green-500/10 text-green-500" :
                                viewStatus === "upcoming" ? "bg-blue-500/10 text-blue-500" :
                                    booking.status === "cancelled" ? "bg-red-500/10 text-red-500" :
                                        "bg-secondary text-muted-foreground"
                                }`}>
                                {viewStatus === "upcoming" ? "upcoming" : booking.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Spot {booking.spotNumber}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(booking.startTime, "MMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right mr-4">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-lg">&euro;{booking.totalPrice.toFixed(2)}</p>
                    </div>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => handleShowTicket(booking)}
                    >
                        <QrCode className="h-4 w-4" />
                        Ticket
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleShowTicket(booking)} className="gap-2">
                                <QrCode className="h-4 w-4" />
                                View Ticket
                            </DropdownMenuItem>
                            {(booking.status === "active" || booking.status === "pending") && (
                                <DropdownMenuItem
                                    onClick={() => handleCancel(booking)}
                                    className="gap-2 text-destructive focus:text-destructive"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Cancel Reservation
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </motion.div>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-serif text-3xl font-bold">{t.userDashboard.navigation.reservations}</h1>
            </div>

            <Tabs defaultValue={defaultTab} key={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">History</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                    {grouped.active.length > 0 ? grouped.active.map((booking) => (
                        <ReservationCard key={booking.id} booking={booking} viewStatus="active" />
                    )) : (
                        <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
                            <Car className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p>{t.userDashboard.emptyReservations?.title || "No active reservations"}</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
                    {grouped.upcoming.length > 0 ? grouped.upcoming.map((booking) => (
                        <ReservationCard key={booking.id} booking={booking} viewStatus="upcoming" />
                    )) : (
                        <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
                            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p>No upcoming reservations</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                    {grouped.past.length > 0 ? grouped.past.map((booking) => (
                        <ReservationCard key={booking.id} booking={booking} viewStatus={booking.status} />
                    )) : (
                        <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
                            <Clock className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p>No past reservations</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Ticket Dialog */}
            <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Parking Ticket</DialogTitle>
                    </DialogHeader>
                    {selectedBooking && (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <div className="h-48 w-48 rounded-2xl bg-white p-4 flex items-center justify-center">
                                    <div className="relative h-full w-full">
                                        {/* Simple QR-like visual pattern */}
                                        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-[2px]">
                                            {Array.from({ length: 64 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`rounded-[1px] ${
                                                        (selectedBooking.id.charCodeAt(i % selectedBooking.id.length) + i) % 3 !== 0
                                                            ? "bg-black"
                                                            : "bg-white"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-center">
                                <h3 className="font-bold text-lg">{selectedBooking.parkingName}</h3>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Spot {selectedBooking.spotNumber}</p>
                                    <p>{format(selectedBooking.startTime, "MMM d, yyyy")} &bull; {format(selectedBooking.startTime, "HH:mm")} - {format(selectedBooking.endTime, "HH:mm")}</p>
                                    <p className="font-semibold text-foreground">&euro;{selectedBooking.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
                                <code className="flex-1 text-xs truncate">{selectedBooking.id}</code>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyId(selectedBooking.id)}
                                    className="shrink-0"
                                >
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
