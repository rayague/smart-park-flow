"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bell, Search, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { useAuthStore, useUIStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export function AdminHeader() {
    const { user } = useAuthStore()
    const { notifications, fetchNotifications } = useUIStore()
    const { t } = useTranslation()

    React.useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/50 glass px-6"
        >
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={`${t.common.search} users, parkings...`}
                        className="pl-10 bg-secondary/50 border-0"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />

                <Button variant="ghost" size="icon" className="relative cursor-pointer">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                            {unreadCount}
                        </span>
                    )}
                </Button>

                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>

                {/* Admin badge */}
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border/50">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 ring-2 ring-red-500/30">
                        <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                        <p className="text-xs text-red-500 font-medium">Super Admin</p>
                    </div>
                </div>
            </div>
        </motion.header>
    )
}
