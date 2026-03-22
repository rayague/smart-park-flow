"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ManagerSidebar } from "@/components/manager/sidebar"
import { ManagerHeader } from "@/components/manager/header"
import { DashboardFooter } from "@/components/dashboard/footer"

import { useAuthStore, useUIStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"
import { AuthLoadingOverlay } from "@/components/auth/auth-loading-overlay"
import { cn } from "@/lib/utils"

export default function ProprietaireLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname() || "/dashboard/proprietaire"
    const router = useRouter()
    const { isLoading } = useAuthStore()
    const { t } = useTranslation()
    const { isSidebarOpen } = useUIStore()

    React.useEffect(() => {
        const nextPath = pathname.replace(/^\/dashboard\/proprietaire/, "/dashboard/manager")
        if (nextPath !== pathname) {
            router.replace(nextPath)
        }
    }, [pathname, router])

    if (pathname.startsWith("/dashboard/proprietaire")) {
        return <AuthLoadingOverlay isLoading={isLoading} message={t.common.loading} />
    }

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <AuthLoadingOverlay isLoading={isLoading} message={t.common.loading} />
            <ManagerSidebar />
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300",
                isSidebarOpen ? "lg:pl-64" : "lg:pl-[72px]"
            )}>
                <ManagerHeader />
                <main className="p-4 md:p-6 flex-1 overflow-x-hidden">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
                <div className="px-4 md:px-6">
                    <DashboardFooter />
                </div>
            </div>
        </div>
    )
}
