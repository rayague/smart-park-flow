"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { UsersTable } from "@/components/admin/users-table"
import { useTranslation } from "@/lib/i18n"
import { Search, Filter, Download, Plus, UserPlus, Shield, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function AdminUsersPage() {
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [roleFilter, setRoleFilter] = React.useState<"all" | "USER" | "MANAGER" | "ADMIN">("all")

    const [managerStats, setManagerStats] = React.useState({
        total: 0,
        pending: 0,
        active: 0,
        revoked: 0
    })

    React.useEffect(() => {
        async function fetchStats() {
            try {
                const [managersRes, pendingRes, activeRes, revokedRes] = await Promise.all([
                    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "MANAGER"),
                    supabase.from("parkings").select("id", { count: "exact", head: true }).eq("status", "INACTIVE"),
                    supabase.from("parkings").select("id", { count: "exact", head: true }).eq("status", "ACTIVE"),
                    supabase.from("parkings").select("id", { count: "exact", head: true }).eq("status", "MAINTENANCE"),
                ])
                setManagerStats({
                    total: managersRes.count ?? 0,
                    pending: pendingRes.count ?? 0,
                    active: activeRes.count ?? 0,
                    revoked: revokedRes.count ?? 0
                })
            } catch (e) {
                console.error("Failed to load manager stats:", e)
            }
        }
        fetchStats()
    }, [])


    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                        {t.adminDashboard.navigation.users}
                    </h1>
                    <p className="text-muted-foreground">
                        Manage all platform users, monitor activity, and handle account status.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/20">
                                <Plus className="h-4 w-4" />
                                {t.adminDashboard.actions.addUser}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{t.adminDashboard.actions.addUser}</DialogTitle>
                                <DialogDescription>
                                    Create a new user account manually. Fill in the details below.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input placeholder="John Doe" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input placeholder="john@example.com" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Role</label>
                                    <Tabs defaultValue="USER">
                                        <TabsList className="w-full">
                                            <TabsTrigger value="USER" className="flex-1">User</TabsTrigger>
                                            <TabsTrigger value="MANAGER" className="flex-1">Manager</TabsTrigger>
                                            <TabsTrigger value="ADMIN" className="flex-1">Admin</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => toast.success("User added successfully")}>
                                    Create Account
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search users..." 
                            className="pl-9 glass" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Tabs value={roleFilter} onValueChange={(v: any) => setRoleFilter(v)} className="hidden lg:block">
                        <TabsList className="glass">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="USER">Drivers</TabsTrigger>
                            <TabsTrigger value="MANAGER">Managers</TabsTrigger>
                            <TabsTrigger value="ADMIN">Admins</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <Button variant="outline" className="glass gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </motion.div>

            <UsersTable roleFilter={roleFilter} searchQuery={searchQuery} />

            {roleFilter === "MANAGER" && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: t.adminDashboard.managerStats.total, value: managerStats.total, icon: Building2, color: "text-purple-500" },
                        { label: t.adminDashboard.managerStats.pending, value: managerStats.pending, icon: Building2, color: "text-yellow-500" },
                        { label: t.adminDashboard.managerStats.active, value: managerStats.active, icon: Building2, color: "text-green-500" },
                        { label: t.adminDashboard.managerStats.revoked, value: managerStats.revoked, icon: Building2, color: "text-red-500" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl glass p-6"
                        >
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
