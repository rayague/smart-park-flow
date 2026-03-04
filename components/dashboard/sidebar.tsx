"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Car,
  LayoutDashboard,
  MapPin,
  CalendarDays,
  History,
  Settings,
  HelpCircle,
  ChevronLeft,
  BarChart3,
  Users,
  Building2,
  Zap,
  CreditCard,
  Bell,
} from "lucide-react"
import { LogOut } from "lucide-react"
import { useUIStore, useAuthStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const userNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/map", label: "Find Parking", icon: MapPin },
  { href: "/dashboard/reservations", label: "My Reservations", icon: CalendarDays },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

const managerNavItems = [
  { href: "/dashboard/manager", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/manager/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/manager/spots", label: "Manage Spots", icon: Car },
  { href: "/dashboard/manager/chargers", label: "EV Chargers", icon: Zap },
  { href: "/dashboard/manager/revenue", label: "Revenue", icon: CreditCard },
  { href: "/dashboard/manager/settings", label: "Settings", icon: Settings },
]

const adminNavItems = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/parkings", label: "Parkings", icon: Building2 },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false)
  const router = require("next/navigation").useRouter()

  const handleLogout = async () => {
    try {
      setLogoutDialogOpen(false)
      const { signOut } = await import("@/lib/auth")
      await signOut()
      logout()
      setTimeout(() => {
        window.location.href = "/"
      }, 100)
    } catch (error) {
      console.error("Logout error:", error)
      logout()
      setTimeout(() => {
        window.location.href = "/"
      }, 100)
    }
  }

  const navItems = React.useMemo(() => {
    switch (user?.role) {
      case "admin":
        return adminNavItems
      case "manager":
        return managerNavItems
      default:
        return userNavItems
    }
  }, [user?.role])

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 280 : 80,
          x: 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar",
          "lg:relative lg:z-auto"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-serif text-lg font-bold"
                >
                  SmartPark
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex"
          >
            <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }}>
              <ChevronLeft className="h-5 w-5" />
            </motion.div>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <AnimatePresence>
                  {isSidebarOpen && (
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
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute inset-0 rounded-xl bg-sidebar-primary"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Help */}
        <div className="border-t border-sidebar-border p-3">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <HelpCircle className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  Help & Support
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* User Profile */}
        <div className="border-t border-sidebar-border p-3">
          <div className={cn(
            "flex items-center gap-3 rounded-xl p-2",
            isSidebarOpen ? "bg-sidebar-accent/50" : ""
          )}>
            <Avatar className="h-10 w-10 shrink-0 border-2 border-sidebar-border">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate font-medium">{user?.name}</p>
                  <p className="truncate text-xs capitalize text-sidebar-foreground/60">
                    {user?.role}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size={isSidebarOpen ? "default" : "icon"}
                className={cn(
                  "mt-2 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 cursor-pointer",
                  isSidebarOpen ? "w-full justify-start gap-3" : "w-full"
                )}
              >
                <LogOut className="h-4 w-4" />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      Sign Out
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Sign Out</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to sign out? You will need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setLogoutDialogOpen(false)}>Cancel</AlertDialogCancel>
                <Button onClick={handleLogout} variant="destructive" className="cursor-pointer">
                  Sign Out
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.aside>
    </>
  )
}
