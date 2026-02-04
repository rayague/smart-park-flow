"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { UsersTable } from "@/components/admin/users-table"
import { useTranslation } from "@/lib/i18n"
import { Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminUsersPage() {
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
                    <Input placeholder="Search users by name or email..." className="pl-9 glass" />
                </div>
                <Button variant="outline" className="glass gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </motion.div>

            <UsersTable />
        </div>
    )
}
