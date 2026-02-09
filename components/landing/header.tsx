"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, X, Car } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUIStore, useAuthStore } from "@/lib/store"
import { useTranslation, type Language } from "@/lib/i18n"
import { LayoutDashboard, LogOut, User as UserIcon, Zap, MapPin, Shield, Info } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const { openAuthModal } = useUIStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { t, language } = useTranslation()
  const router = require("next/navigation").useRouter()

  const handleLogout = async () => {
    try {
      const { signOut } = await import("@/lib/auth")
      await signOut()
      logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
      logout()
      router.push("/")
    }
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20)
  })

  const navItems = [
    { label: t.nav.features, href: "/features", icon: Zap },
    { label: t.nav.parkings, href: "/discover", icon: MapPin },
    { label: t.nav.pricing, href: "/pricing", icon: Shield },
    { label: t.nav.about, href: "/about", icon: Info },
  ];

  return (
    <motion.header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled || mobileMenuOpen
          ? "glass border-b border-border/50 py-3"
          : "bg-transparent py-5"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent transition-transform group-hover:scale-110">
            <Car className="h-6 w-6 text-white" />
          </div>
          <span className="font-serif text-xl font-bold">
            Smart<span className="text-primary">Park</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary relative py-2",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 transition-transform group-hover:scale-110",
                pathname === item.href ? "text-primary" : "text-muted-foreground/50"
              )} />
              {item.label}
              {pathname === item.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center border-r border-border/50 pr-4 gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-all p-0">
                  <UserIcon className="h-5 w-5 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-strong w-56 p-2" sideOffset={8}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-secondary">
                  <Link href="/dashboard" className="flex items-center gap-2 w-full">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive focus:text-destructive gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>{t.common.signOut}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="font-medium" asChild>
                <Link href="/login">{t.nav.signIn}</Link>
              </Button>
              <Button className="font-medium glow-primary bg-gradient-to-r from-primary to-accent" asChild>
                <Link href="/register">{t.nav.getStarted}</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="container mx-auto px-4 md:hidden"
        >
          <div className="rounded-2xl glass mt-2 p-4 space-y-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl hover:bg-secondary/50 font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="h-px bg-border/50" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-muted-foreground">Settings</span>
                <div className="flex gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/login">{t.nav.signIn}</Link>
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-primary to-accent" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/register">{t.nav.getStarted}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
