"use client"

import * as React from "react"
import { UserSidebar } from "@/components/dashboard/user-sidebar"
import { UserHeader } from "@/components/dashboard/user-header"
import { DashboardFooter } from "@/components/dashboard/footer"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useAuthStore, useTranslation } from "@/lib/store"
import { AuthLoadingOverlay } from "@/components/auth/auth-loading-overlay"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname() || ""
  const router = useRouter()
  const { user, initialized, isLoading } = useAuthStore()
  const { t } = useTranslation()

  // Don't show user sidebar for proprietaire/admin routes as they have their own layouts
  const isSpecialDashboard = pathname.startsWith("/dashboard/proprietaire") ||
    pathname.startsWith("/dashboard/manager") ||
    pathname.startsWith("/dashboard/admin")

  React.useEffect(() => {
    if (!initialized) return
    if (!user) router.push("/login")
  }, [initialized, user, router])

  if (isSpecialDashboard) {
    return (
      <>
        <AuthLoadingOverlay isLoading={isLoading} message={t.common.loading} />
        {children}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AuthLoadingOverlay isLoading={isLoading} message={t.common.loading} />
      <UserSidebar />
      <div className="pl-64 flex-1 flex flex-col transition-all duration-300">
        <UserHeader />
        <main className="p-6 flex-1">
          {children}
        </main>
        <div className="px-6">
          <DashboardFooter />
        </div>
      </div>
    </div>
  )
}
