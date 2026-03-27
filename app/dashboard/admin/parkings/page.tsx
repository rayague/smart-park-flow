"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Search,
    MapPin,
    Building2,
    Car,
    MoreHorizontal,
    Table as TableIcon,
    LayoutGrid,
    Calendar,
    ChevronRight,
    Filter,
    Download,
    Plus,
    Edit,
    ExternalLink,
    Trash2
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useReservationStore } from "@/lib/store"

interface ParkingData {
    id: string
    name: string
    manager: string
    manager_id: string
    location: string
    status: string
    spots: number
    revenue: number
    address: string
    city: string
}

export default function AdminParkingsPage() {
    const { t } = useTranslation()
    const { reservations } = useReservationStore()
    const [parkings, setParkings] = React.useState<ParkingData[]>([])
    const [loading, setLoading] = React.useState(true)
    const [viewMode, setViewMode] = React.useState<"grid" | "table">("table")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedParking, setSelectedParking] = React.useState<ParkingData | null>(null)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
    const [isSuspendConfirmOpen, setIsSuspendConfirmOpen] = React.useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    
    // Edit form state
    const [editName, setEditName] = React.useState("")
    const [editAddress, setEditAddress] = React.useState("")
    const [editCity, setEditCity] = React.useState("")

    const fetchParkings = React.useCallback(async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('parkings')
                .select('*, profiles:manager_id(name)')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Failed to fetch parkings:', error)
                setParkings([])
            } else {
                const mapped: ParkingData[] = (data || []).map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    manager: p.profiles?.name || 'Unknown',
                    manager_id: p.manager_id,
                    location: `${p.city || ''}${p.address ? `, ${p.address}` : ''}`,
                    status: (p.status || 'ACTIVE').toLowerCase(),
                    spots: p.total_spots || 0,
                    revenue: (p.total_spots - (p.available_spots ?? p.total_spots)) * p.price_per_hour || 0,
                    address: p.address || '',
                    city: p.city || '',
                }))
                setParkings(mapped)
            }
        } catch (error) {
            console.error("Failed to fetch parkings:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchParkings()
    }, [fetchParkings])

    const handleDeleteParking = async () => {
        if (!selectedParking) return
        setIsSubmitting(true)
        try {
            // First delete related records to satisfy foreign key constraints
            await supabase.from('reservations').delete().eq('parking_id', selectedParking.id)
            await supabase.from('spots').delete().eq('parking_id', selectedParking.id)
            
            // Then delete the parking
            const { error } = await supabase.from('parkings').delete().eq('id', selectedParking.id)
            if (error) throw error
            
            toast.success("Parking deleted successfully")
            setIsDeleteConfirmOpen(false)
            fetchParkings()
        } catch (error: any) {
            toast.error(error.message || "Failed to delete parking")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSuspendParking = async () => {
        if (!selectedParking) return
        setIsSubmitting(true)
        try {
            const isCurrentlyActive = selectedParking.status === "active"
            const newStatus = isCurrentlyActive ? "INACTIVE" : "ACTIVE"
            
            const { error } = await supabase
                .from('parkings')
                .update({ status: newStatus })
                .eq('id', selectedParking.id)
            
            if (error) throw error
            
            // Send notification to manager if suspended
            if (isCurrentlyActive && selectedParking.manager_id) {
                await supabase.from('notifications').insert({
                    user_id: selectedParking.manager_id,
                    type: 'warning',
                    title: t.adminDashboard.actions.parkingSuspendedTitle,
                    message: t.adminDashboard.actions.parkingSuspendedMessage.replace('{name}', selectedParking.name),
                    created_at: new Date().toISOString()
                })
            }
            
            toast.success(isCurrentlyActive ? "Parking suspended successfully" : "Parking activated successfully")
            setIsSuspendConfirmOpen(false)
            fetchParkings()
        } catch (error: any) {
            toast.error(error.message || "Failed to update status")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateParking = async () => {
        if (!selectedParking) return
        setIsSubmitting(true)
        try {
            const { error } = await supabase
                .from('parkings')
                .update({ 
                    name: editName,
                    address: editAddress,
                    city: editCity
                })
                .eq('id', selectedParking.id)
            
            if (error) throw error
            
            toast.success("Parking updated successfully")
            setIsEditModalOpen(false)
            fetchParkings()
        } catch (error: any) {
            toast.error(error.message || "Failed to update parking")
        } finally {
            setIsSubmitting(false)
        }
    }

    const openEditModal = (parking: ParkingData) => {
        setSelectedParking(parking)
        setEditName(parking.name)
        setEditAddress(parking.address)
        setEditCity(parking.city)
        setIsEditModalOpen(true)
    }

    const filteredParkings = parkings.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.manager.toLowerCase().includes(searchQuery.toLowerCase())
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
                        {t.adminDashboard.navigation.parkings}
                    </h1>
                    <p className="text-muted-foreground">
                        {t.adminDashboard.subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-2 border border-border/50 rounded-lg p-1 glass">
                    <Button
                        variant={viewMode === "table" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("table")}
                        className="gap-2"
                    >
                        <TableIcon className="h-4 w-4" /> {t.common.viewAll}
                    </Button>
                    <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="gap-2"
                    >
                        <LayoutGrid className="h-4 w-4" /> Grid
                    </Button>
                </div>
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
                        placeholder={t.discover.searchPlaceholder}
                        className="pl-9 glass"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="glass">{t.adminDashboard.parkings.advancedFilters}</Button>
            </motion.div>

            {viewMode === "table" ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl glass p-6 overflow-x-auto"
                >
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">{t.adminDashboard.parkings.facility}</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">{t.adminDashboard.parkings.manager}</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">{t.adminDashboard.parkings.location}</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">{t.adminDashboard.parkings.spots}</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">{t.adminDashboard.parkings.revenue}</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">{t.adminDashboard.parkings.status}</th>
                                <th className="pb-3 text-right text-sm font-medium text-muted-foreground">{t.adminDashboard.parkings.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {loading ? (
                                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">{t.common.loading}</td></tr>
                            ) : filteredParkings.length === 0 ? (
                                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No parkings found</td></tr>
                            ) : (
                                filteredParkings.map((parking, i) => (
                                    <tr key={parking.id} className="group hover:bg-primary/5 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-primary-box flex items-center justify-center text-primary">
                                                    <Car className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">{parking.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                {parking.manager}
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {parking.location}
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm font-bold">{parking.spots}</td>
                                        <td className="py-4 text-sm font-bold">€{parking.revenue.toLocaleString()}</td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${parking.status === "active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                                }`}>
                                                {parking.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openEditModal(parking)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        {t.common.edit}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => {
                                                            setSelectedParking(parking)
                                                            setIsSuspendConfirmOpen(true)
                                                        }}
                                                    >
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        {parking.status === "active" ? t.adminDashboard.actions.suspend : t.adminDashboard.actions.activate}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        onClick={() => {
                                                            setSelectedParking(parking)
                                                            setIsDeleteConfirmOpen(true)
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {t.common.delete}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )))}
                        </tbody>
                    </table>
                </motion.div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <div className="col-span-full py-8 text-center text-muted-foreground">Loading...</div>
                    ) : filteredParkings.length === 0 ? (
                        <div className="col-span-full py-8 text-center text-muted-foreground">No parkings found</div>
                    ) : (
                        filteredParkings.map((parking, i) => (
                            <motion.div
                                key={parking.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="rounded-2xl glass p-6 card-hover"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary-box flex items-center justify-center text-primary">
                                        <Car className="h-5 w-5" />
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${parking.status === "active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                        }`}>
                                        {parking.status}
                                    </span>
                                </div>
                                <h3 className="font-serif text-lg font-bold mb-1">{parking.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                                    <Building2 className="h-3 w-3" /> {t.adminDashboard.parkings.managedBy} {parking.manager}
                                </p>
                                <div className="grid grid-cols-2 gap-4 mt-auto border-t border-border/50 pt-4">
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground tracking-widest">{t.adminDashboard.parkings.spots}</p>
                                        <p className="font-bold">{parking.spots}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-muted-foreground tracking-widest">{t.adminDashboard.parkings.revenue}</p>
                                        <p className="font-bold">€{parking.revenue.toLocaleString()}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">{t.common.confirm}</DialogTitle>
                        <DialogDescription>
                            {t.adminDashboard.actions.confirmDeleteParking}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                            {t.common.cancel}
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteParking} disabled={isSubmitting}>
                            {isSubmitting ? t.common.loading : t.common.delete}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend Confirmation Dialog */}
            <Dialog open={isSuspendConfirmOpen} onOpenChange={setIsSuspendConfirmOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t.adminDashboard.actions.suspendConfirmTitle}</DialogTitle>
                        <DialogDescription>
                            {t.adminDashboard.actions.suspendConfirmDescription}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsSuspendConfirmOpen(false)}>
                            {t.common.cancel}
                        </Button>
                        <Button 
                            className={selectedParking?.status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} 
                            onClick={handleSuspendParking} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t.common.loading : (selectedParking?.status === "active" ? t.adminDashboard.actions.suspend : t.adminDashboard.actions.activate)}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Parking Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t.common.edit} - {selectedParking?.name}</DialogTitle>
                        <DialogDescription>
                            Update the parking details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Address</label>
                            <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">City</label>
                            <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            {t.common.cancel}
                        </Button>
                        <Button onClick={handleUpdateParking} disabled={isSubmitting}>
                            {isSubmitting ? t.common.loading : t.common.save}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
