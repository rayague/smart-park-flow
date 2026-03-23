"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Car,
    MapPin,
    Clock,
    Calendar,
    CreditCard,
    ArrowRight,
    Plus,
    Zap,
    Palette,
    Hash,
    Loader2,
    Trash2,
    Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useTranslation } from "@/lib/i18n"
import { useAuthStore, useReservationStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Vehicle {
    id: string
    plate: string
    brand: string | null
    model: string | null
    color: string | null
    is_electric: boolean
    is_default: boolean
}

function VehicleSection() {
    const { user } = useAuthStore()
    const { toast } = useToast()
    const [vehicles, setVehicles] = React.useState<Vehicle[]>([])
    const [loading, setLoading] = React.useState(true)
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [saving, setSaving] = React.useState(false)

    const [plate, setPlate] = React.useState("")
    const [brand, setBrand] = React.useState("")
    const [model, setModel] = React.useState("")
    const [color, setColor] = React.useState("")
    const [isElectric, setIsElectric] = React.useState(false)

    React.useEffect(() => {
        if (!user) return
        const load = async () => {
            const { data } = await supabase
                .from("vehicles")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
            if (data) setVehicles(data.map(v => ({ ...v, is_electric: !!v.is_electric, is_default: !!v.is_default })))
            setLoading(false)
        }
        load()
    }, [user])

    const resetForm = () => {
        setPlate("")
        setBrand("")
        setModel("")
        setColor("")
        setIsElectric(false)
    }

    const handleAdd = async () => {
        if (!user || !plate.trim()) return
        setSaving(true)
        try {
            const { data, error } = await supabase
                .from("vehicles")
                .insert({
                    user_id: user.id,
                    plate: plate.toUpperCase().trim(),
                    brand: brand.trim() || null,
                    model: model.trim() || null,
                    color: color.trim() || null,
                    is_electric: isElectric,
                    is_default: vehicles.length === 0,
                })
                .select()

            if (error) throw error

            if (data?.[0]) {
                setVehicles(prev => [{ ...data[0], is_electric: !!data[0].is_electric, is_default: !!data[0].is_default }, ...prev])
            }
            toast({ title: "Vehicle added!", description: `${plate.toUpperCase()} has been registered.` })
            resetForm()
            setDialogOpen(false)
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        await supabase.from("vehicles").delete().eq("id", id)
        setVehicles(prev => prev.filter(v => v.id !== id))
        toast({ title: "Vehicle removed" })
    }

    if (loading) {
        return (
            <div className="rounded-2xl glass p-6 flex flex-col justify-center items-center text-center h-full min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (vehicles.length === 0) {
        return (
            <>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl glass p-6 flex flex-col justify-center items-center text-center space-y-4"
                >
                    <div className="h-20 w-20 rounded-full bg-accent-box flex items-center justify-center mb-2">
                        <Car className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="font-sans text-xl font-bold">Add Your Vehicle</h3>
                    <p className="text-muted-foreground max-w-xs">
                        Register your vehicle to enable automatic license plate recognition and faster entry.
                    </p>
                    <Button className="mt-4 gap-2" onClick={() => setDialogOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Register Vehicle
                    </Button>
                </motion.div>
                <VehicleDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    plate={plate} setPlate={setPlate}
                    brand={brand} setBrand={setBrand}
                    model={model} setModel={setModel}
                    color={color} setColor={setColor}
                    isElectric={isElectric} setIsElectric={setIsElectric}
                    saving={saving}
                    onSave={handleAdd}
                />
            </>
        )
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl glass p-6 space-y-4"
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-sans text-lg font-semibold">My Vehicles</h3>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => { resetForm(); setDialogOpen(true) }}>
                        <Plus className="h-3 w-3" />
                        Add
                    </Button>
                </div>

                <div className="space-y-3">
                    {vehicles.map((v) => (
                        <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 group">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    {v.is_electric ? <Zap className="h-5 w-5" /> : <Car className="h-5 w-5" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold tracking-wider text-sm">{v.plate}</span>
                                        {v.is_default && (
                                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">Default</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {[v.brand, v.model, v.color].filter(Boolean).join(" · ") || "No details"}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(v.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </motion.div>
            <VehicleDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                plate={plate} setPlate={setPlate}
                brand={brand} setBrand={setBrand}
                model={model} setModel={setModel}
                color={color} setColor={setColor}
                isElectric={isElectric} setIsElectric={setIsElectric}
                saving={saving}
                onSave={handleAdd}
            />
        </>
    )
}

function VehicleDialog({
    open, onOpenChange,
    plate, setPlate,
    brand, setBrand,
    model, setModel,
    color, setColor,
    isElectric, setIsElectric,
    saving, onSave,
}: {
    open: boolean; onOpenChange: (v: boolean) => void
    plate: string; setPlate: (v: string) => void
    brand: string; setBrand: (v: string) => void
    model: string; setModel: (v: string) => void
    color: string; setColor: (v: string) => void
    isElectric: boolean; setIsElectric: (v: boolean) => void
    saving: boolean; onSave: () => void
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        Register a Vehicle
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Hash className="h-3 w-3 text-muted-foreground" />
                            License Plate *
                        </label>
                        <Input
                            value={plate}
                            onChange={(e) => setPlate(e.target.value.toUpperCase())}
                            placeholder="AB-123-CD"
                            className="font-mono tracking-wider text-lg text-center uppercase"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Brand</label>
                            <Input
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                placeholder="Toyota, BMW..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Model</label>
                            <Input
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                placeholder="Corolla, X3..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Palette className="h-3 w-3 text-muted-foreground" />
                            Color
                        </label>
                        <Input
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="Black, White, Red..."
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Electric Vehicle</span>
                        </div>
                        <Switch checked={isElectric} onCheckedChange={setIsElectric} />
                    </div>

                    <Button
                        className="w-full h-11 gap-2"
                        onClick={onSave}
                        disabled={saving || !plate.trim()}
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                        {saving ? "Saving..." : "Add Vehicle"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function ClientDashboard() {
    const { user } = useAuthStore()
    const { t } = useTranslation()
    const { reservations, fetchReservations } = useReservationStore()

    React.useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    const upcomingReservations = reservations
        .filter(r => r.status === 'active' || r.status === 'pending')
        .slice(0, 3)

    const stats = React.useMemo(() => {
        const totalBookings = reservations.length
        const totalHours = reservations.reduce((acc, r) => {
            const start = new Date(r.startTime).getTime()
            const end = new Date(r.endTime).getTime()
            return acc + (end - start) / (1000 * 60 * 60)
        }, 0)
        const amountSpent = reservations.reduce((acc, r) => acc + r.totalPrice, 0)

        return [
            { label: t.userDashboard.stats.totalReservations, value: totalBookings.toString(), icon: Calendar, color: "bg-blue-500/10 text-blue-500" },
            { label: t.userDashboard.stats.hoursParked || "Hours Parked", value: `${Math.round(totalHours)}h`, icon: Clock, color: "bg-orange-500/10 text-orange-500" },
            { label: t.userDashboard.stats.totalSpent, value: `€${amountSpent.toFixed(2)}`, icon: CreditCard, color: "bg-green-500/10 text-green-500" },
        ]
    }, [reservations, t.userDashboard.stats])

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 text-white"
            >
                <div className="relative z-10">
                    <h1 className="font-sans text-3xl font-bold mb-2">
                        {t.userDashboard.welcome}, {user?.name || "Client"}!
                    </h1>
                    <p className="opacity-90 max-w-xl">
                        {t.userDashboard.subtitle}
                    </p>
                    <div className="mt-6 flex gap-4">
                        <Link href="/discover">
                            <Button size="lg" variant="secondary" className="gap-2">
                                <MapPin className="h-4 w-4" />
                                {t.userDashboard.findParking}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 right-20 -mb-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-3">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="rounded-2xl glass p-6 card-hover"
                    >
                        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="text-2xl font-bold mb-1">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Upcoming Reservations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl glass p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-sans text-xl font-semibold">
                            {t.userDashboard.sections.activeReservations}
                        </h3>
                        <Link href="/dashboard/client/reservations">
                            <Button variant="ghost" size="sm" className="gap-1">
                                {t.common.viewAll} <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {upcomingReservations.length > 0 ? (
                            upcomingReservations.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-subtle bg-subtle-hover transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-icon-box text-primary">
                                            <Car className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{booking.parkingName}</h4>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                Spot {booking.spotNumber}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-sm">{format(booking.startTime, "MMM d, HH:mm")}</div>
                                        <div className="text-sm text-muted-foreground">{format(booking.endTime, "HH:mm")}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">
                                {t.userDashboard.emptyReservations.title}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Vehicle Section */}
                <VehicleSection />
            </div>
        </div>
    )
}
