"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { UsersTable } from "@/components/admin/users-table" // We can reuse and filter or simulate
import { useTranslation } from "@/lib/i18n"
import { Search, Filter, Plus, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminManagersPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                        {t.adminDashboard.navigation.managers}
                    </h1>
                    <p className="text-muted-foreground">
                        Manage parking facility managers, verify certifications, and assign parking zones.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="gap-2 bg-gradient-to-r from-red-500 to-orange-500">
                        <Plus className="h-4 w-4" />
                        {t.adminDashboard.actions.addUser}
                    </Button>
                </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Managers", value: "142", icon: Building2, color: "text-purple-500" },
                    { label: "Pending Verification", value: "12", icon: Building2, color: "text-yellow-500" },
                    { label: "Active Facilities", value: "385", icon: Building2, color: "text-green-500" },
                    { label: "Revoked Licenses", value: "3", icon: Building2, color: "text-red-500" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl glass p-6"
                    >
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <UsersTable />
        </div>
    )
}
