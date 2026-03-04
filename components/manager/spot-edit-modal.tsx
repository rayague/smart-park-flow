"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Zap, Car, AlertTriangle } from "lucide-react"

interface Spot {
    id: string
    name: string
    status: "occupied" | "maintenance" | "available"
    type: "ev" | "standard"
}

interface SpotEditModalProps {
    spot: Spot | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function SpotEditModal({ spot, open, onOpenChange, onSuccess }: SpotEditModalProps) {
    const [status, setStatus] = React.useState<string>("")
    const [type, setType] = React.useState<string>("")
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (spot) {
            setStatus(spot.status.toUpperCase())
            setType(spot.type === "standard" ? "REGULAR" : "EV")
        }
    }, [spot])

    const handleSave = async () => {
        if (!spot) return

        setLoading(true)
        try {
            const response = await fetch("/api/spots/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    spotId: spot.id,
                    status,
                    type,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Failed to update spot")
            }

            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error("Error updating spot:", error)
            alert("Erreur lors de la mise à jour de la place.")
        } finally {
            setLoading(false)
        }
    }

    if (!spot) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] glass border-primary/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-serif">
                        Modifier la Place {spot.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="status">Statut de la place</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger id="status" className="glass">
                                <SelectValue placeholder="Choisir un statut" />
                            </SelectTrigger>
                            <SelectContent className="glass">
                                <SelectItem value="AVAILABLE">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span>Disponible</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="OCCUPIED">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-secondary" />
                                        <span>Occupée</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="MAINTENANCE">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                        <span>Maintenance</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">Type de place</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger id="type" className="glass">
                                <SelectValue placeholder="Choisir un type" />
                            </SelectTrigger>
                            <SelectContent className="glass">
                                <SelectItem value="REGULAR">Standard</SelectItem>
                                <SelectItem value="EV">Borne Électrique (EV)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs text-muted-foreground">
                        <p className="flex items-start gap-2">
                            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                            <span>
                                La modification du statut affectera la disponibilité en temps réel pour les utilisateurs.
                            </span>
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
                        Annuler
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="min-w-[100px]">
                        {loading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
