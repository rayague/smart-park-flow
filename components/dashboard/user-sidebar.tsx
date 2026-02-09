"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    Calendar,
    Heart,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Car,
    Map as MapIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export function UserSidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const { user, logout } = useAuthStore()
    const { t } = useTranslation()
    const router = require("next/navigation").useRouter()

    const handleLogout = async () => {
        try {
            const { signOut } = await import("@/lib/auth")
            await signOut()
            logout()
            router.push("/")
        } catch (error) {
            console.error("Logout error:", error)
            logout()
            router.push("/")
        }
    }

    const navItems = [
        {
            href: "/dashboard/client",
            label: t.userDashboard.navigation.overview,
            icon: LayoutDashboard,
            exact: true
        },
        {
            href: "/dashboard/client/reservations",
            label: t.userDashboard.navigation.reservations,
            icon: Calendar
        },
        {
            href: "/discover",
            label: t.userDashboard.navigation.findParking,
            icon: MapIcon
        },
        {
            href: "/dashboard/client/favorites",
            label: t.userDashboard.navigation.favorites,
            icon: Heart
        },
        {
            href: "/dashboard/client/settings",
            label: t.userDashboard.navigation.settings,
            icon: Settings
        },
    ]

    const isActive = (href: string, exact?: boolean) => {
        const path = pathname || ""
        if (exact) return path === href
        return path.startsWith(href)
    }

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={cn(
                "fixed left-0 top-0 z-40 flex h-screen flex-col glass-strong border-r border-border/50 transition-all duration-300",
                isCollapsed ? "w-[72px]" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
                <Link href="/dashboard/client" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                        <Car className="h-5 w-5 text-white" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-serif text-lg font-bold"
                            >
                                Smart<span className="text-primary">Park</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="h-8 w-8"
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item, index) => {
                    const active = isActive(item.href, item.exact)
                    return (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                                    active
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 flex-shrink-0",
                                    active && "text-primary-foreground"
                                )} />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="truncate"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        </motion.div>
                    )
                })}
            </nav>

            {/* User Section */}
            <div className="border-t border-border/50 p-3">
                <div className={cn(
                    "flex items-center gap-3 rounded-xl p-2",
                    isCollapsed && "justify-center"
                )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                        <span className="text-sm font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="truncate text-sm font-medium">
                                    {user?.name || "User"}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {user?.email || "user@smartpark.com"}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Button
                    variant="ghost"
                    size={isCollapsed ? "icon" : "default"}
                    onClick={handleLogout}
                    className={cn(
                        "mt-2 text-muted-foreground hover:text-destructive",
                        isCollapsed ? "w-full" : "w-full justify-start gap-3"
                    )}
                >
                    <LogOut className="h-4 w-4" />
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                            >
                                {t.common.signOut}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </div>
        </motion.aside>
    )
}
