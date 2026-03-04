"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, CheckCircle2, AlertCircle, ParkingCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParkingStore, NewParkingData } from "@/lib/store"

interface AddParkingModalProps {
    open: boolean
    onClose: () => void
}

const defaultForm: NewParkingData = {
    name: "",
    address: "",
    city: "",
    totalSpots: 0,
    pricePerHour: 0,
    hasEvCharging: false,
    openingHours: { open: "07:00", close: "22:00" },
}

export function AddParkingModal({ open, onClose }: AddParkingModalProps) {
    const { createParking } = useParkingStore()
    const [form, setForm] = React.useState<NewParkingData>(defaultForm)
    const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
    const [errorMsg, setErrorMsg] = React.useState("")

    // Reset form when modal opens
    React.useEffect(() => {
        if (open) {
            setForm(defaultForm)
            setStatus("idle")
            setErrorMsg("")
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim() || !form.address.trim() || !form.city.trim()) {
            setErrorMsg("Veuillez remplir tous les champs obligatoires.")
            setStatus("error")
            return
        }
        setStatus("loading")
        setErrorMsg("")
        try {
            await createParking(form)
            setStatus("success")
            setTimeout(() => onClose(), 1200)
        } catch (err: any) {
            setErrorMsg(err?.message ?? "Une erreur est survenue.")
            setStatus("error")
        }
    }

    const set = (field: keyof NewParkingData, value: any) =>
        setForm((prev) => ({ ...prev, [field]: value }))

    const setHours = (key: "open" | "close", value: string) =>
        setForm((prev) => ({ ...prev, openingHours: { ...prev.openingHours, [key]: value } }))

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="backdrop"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
                        className="relative z-10 w-full max-w-lg rounded-2xl border border-border/60 bg-background shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                                    <ParkingCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="font-serif text-lg font-bold">Ajouter un parking</h2>
                                    <p className="text-xs text-muted-foreground">Les champs * sont obligatoires</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Nom du parking *</label>
                                <Input
                                    placeholder="ex: Parking Central"
                                    value={form.name}
                                    onChange={(e) => set("name", e.target.value)}
                                    className="glass"
                                />
                            </div>

                            {/* Address + City */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Adresse *</label>
                                    <Input
                                        placeholder="12 rue Gambetta"
                                        value={form.address}
                                        onChange={(e) => set("address", e.target.value)}
                                        className="glass"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Ville *</label>
                                    <Input
                                        placeholder="Paris"
                                        value={form.city}
                                        onChange={(e) => set("city", e.target.value)}
                                        className="glass"
                                    />
                                </div>
                            </div>

                            {/* Spots + Price */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Nombre de places *</label>
                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder="50"
                                        value={form.totalSpots || ""}
                                        onChange={(e) => set("totalSpots", Number(e.target.value))}
                                        className="glass"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Prix / heure (€) *</label>
                                    <Input
                                        type="number"
                                        min={0}
                                        step={0.5}
                                        placeholder="2.50"
                                        value={form.pricePerHour || ""}
                                        onChange={(e) => set("pricePerHour", Number(e.target.value))}
                                        className="glass"
                                    />
                                </div>
                            </div>

                            {/* Opening hours */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Ouverture</label>
                                    <Input
                                        type="time"
                                        value={form.openingHours.open}
                                        onChange={(e) => setHours("open", e.target.value)}
                                        className="glass"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Fermeture</label>
                                    <Input
                                        type="time"
                                        value={form.openingHours.close}
                                        onChange={(e) => setHours("close", e.target.value)}
                                        className="glass"
                                    />
                                </div>
                            </div>

                            {/* EV charging toggle */}
                            <button
                                type="button"
                                onClick={() => set("hasEvCharging", !form.hasEvCharging)}
                                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${form.hasEvCharging
                                        ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                                        : "border-border/50 bg-secondary/50 text-muted-foreground hover:bg-secondary"
                                    }`}
                            >
                                <Zap className={`h-4 w-4 ${form.hasEvCharging ? "text-blue-400" : ""}`} />
                                Bornes de recharge électrique
                                <span className={`ml-auto text-xs ${form.hasEvCharging ? "text-blue-400" : ""}`}>
                                    {form.hasEvCharging ? "Activé" : "Désactivé"}
                                </span>
                            </button>

                            {/* Feedback */}
                            <AnimatePresence>
                                {status === "error" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                                    >
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        {errorMsg}
                                    </motion.div>
                                )}
                                {status === "success" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-500"
                                    >
                                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                        Parking ajouté avec succès !
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-1">
                                <Button type="button" variant="outline" onClick={onClose} disabled={status === "loading"}>
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={status === "loading" || status === "success"} className="gap-2 min-w-[110px]">
                                    {status === "loading" ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Enregistrement…
                                        </>
                                    ) : status === "success" ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Enregistré !
                                        </>
                                    ) : (
                                        "Enregistrer"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
