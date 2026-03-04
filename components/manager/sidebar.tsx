"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    ParkingCircle,
    MapPin,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Car
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export function ManagerSidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)
    const { user, logout } = useAuthStore()
    const { t } = useTranslation()

    const handleLogout = async () => {
        setShowLogoutConfirm(false)
        try {
            const { signOut } = await import("@/lib/auth")
            await signOut()
        } catch (error) {
            console.error("SignOut error:", error)
        }
        logout()
        window.location.href = "/"
    }

    const navItems = [
        {
            href: "/dashboard/manager",
            label: t.managerDashboard.navigation.overview,
            icon: LayoutDashboard,
            exact: true
        },
        {
            href: "/dashboard/manager/parkings",
            label: t.managerDashboard.navigation.parkings,
            icon: ParkingCircle
        },
        {
            href: "/dashboard/manager/spots",
            label: t.managerDashboard.navigation.spots,
            icon: MapPin
        },
        {
            href: "/dashboard/manager/analytics",
            label: t.managerDashboard.navigation.analytics,
            icon: BarChart3
        },
        {
            href: "/dashboard/manager/settings",
            label: t.managerDashboard.navigation.settings,
            icon: Settings
        },
    ]

    const isActive = (href: string, exact?: boolean) => {
        const path = pathname || ""
        if (exact) return path === href
        return path.startsWith(href)
    }

    return (
        <>
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
                    <Link href="/dashboard/manager" className="flex items-center gap-2">
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
                                {user?.name?.charAt(0).toUpperCase() || "M"}
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
                                        {user?.name || "Manager"}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {user?.email || "manager@smartpark.com"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button
                        variant="ghost"
                        size={isCollapsed ? "icon" : "default"}
                        onClick={() => setShowLogoutConfirm(true)}
                        className={cn(
                            "mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer",
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

            {/* Simple Logout Modal */}
            {showLogoutConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowLogoutConfirm(false)}
                >
                    <div
                        className="bg-background rounded-lg border p-6 shadow-lg w-full max-w-sm mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-2">Confirm Sign Out</h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            Are you sure you want to sign out?
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowLogoutConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleLogout}
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

