"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    Users,
    Building2,
    ParkingCircle,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Shield,
    X,
    Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"
import { useLogout } from "@/lib/use-logout"

export function AdminSidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)
    const { user, logout } = useAuthStore()
    const { t } = useTranslation()

    const handleLogout = useLogout()

    const navItems = [
        {
            href: "/dashboard/admin",
            label: t.adminDashboard.navigation.overview,
            icon: LayoutDashboard,
            exact: true
        },
        {
            href: "/dashboard/admin/users",
            label: t.adminDashboard.navigation.users,
            icon: Users
        },
        {
            href: "/dashboard/admin/parkings",
            label: t.adminDashboard.navigation.parkings,
            icon: ParkingCircle
        },
        {
            href: "/dashboard/admin/settings",
            label: t.adminDashboard.navigation.settings,
            icon: Settings
        },
    ]

    const isActive = (href: string, exact?: boolean) => {
        const path = pathname || ""
        if (exact) return path === href
        return path.startsWith(href)
    }

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
                <Link href="/dashboard/admin" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    {(!isCollapsed || typeof window !== 'undefined' && window.innerWidth < 768) && (
                        <div className="flex flex-col">
                            <span className="font-serif text-lg font-bold">
                                Smart<span className="text-primary">Park</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                Admin Panel
                            </span>
                        </div>
                    )}
                </Link>

                {!isCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex h-8 w-8"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item, index) => {
                    const active = isActive(item.href, item.exact)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                                active
                                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md shadow-red-500/20"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 flex-shrink-0",
                                active && "text-white"
                            )} />
                            {(!isCollapsed || typeof window !== 'undefined' && window.innerWidth < 768) && (
                                <span className="truncate">{item.label}</span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* User Section */}
            <div className="border-t border-border/50 p-3">
                <div className={cn(
                    "flex items-center gap-3 rounded-xl p-2",
                    isCollapsed && "md:justify-center"
                )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 ring-2 ring-red-500/50">
                        <Shield className="h-5 w-5 text-red-500" />
                    </div>
                    {(!isCollapsed || typeof window !== 'undefined' && window.innerWidth < 768) && (
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium">
                                {user?.name || "Admin"}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                Super Administrator
                            </p>
                        </div>
                    )}
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
                    {(!isCollapsed || typeof window !== 'undefined' && window.innerWidth < 768) && (
                        <span>{t.common.signOut}</span>
                    )}
                </Button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Nav Header */}
            <div className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md md:hidden">
                <Link href="/dashboard/admin" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
                        <Shield className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-serif text-lg font-bold">SmartPark</span>
                </Link>
                
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 glass-strong border-r border-border/50">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Admin Navigation</SheetTitle>
                            <SheetDescription>
                                Main navigation menu for administrative tasks.
                            </SheetDescription>
                        </SheetHeader>
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border/50 glass-strong transition-all duration-300 md:flex",
                    isCollapsed ? "w-[72px]" : "w-64"
                )}
            >
                <SidebarContent />
            </aside>


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
                                onClick={() => { setShowLogoutConfirm(false); handleLogout(); }}
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
