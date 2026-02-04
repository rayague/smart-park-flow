"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bell, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { useAuthStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export function UserHeader() {
    const { user } = useAuthStore()
    const { t } = useTranslation()

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
                        placeholder={t.common.search + "..."}
                        className="pl-10 bg-secondary/50 border-0"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />

                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                        2
                    </span>
                </Button>
            </div>
        </motion.header>
    )
}
