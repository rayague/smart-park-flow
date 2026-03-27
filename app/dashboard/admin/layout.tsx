"use client"

import * as React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { DashboardFooter } from "@/components/dashboard/footer"
import { useAuthStore, useUIStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"
import { AuthLoadingOverlay } from "@/components/auth/auth-loading-overlay"
import { cn } from "@/lib/utils"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isLoading } = useAuthStore()
    const { t } = useTranslation()
    const { isSidebarOpen } = useUIStore()

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
            <AuthLoadingOverlay isLoading={isLoading} message={t.common.loading} />
            <AdminSidebar />
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300 pt-16 md:pt-0",
                isSidebarOpen ? "lg:pl-64" : "lg:pl-[72px]"
            )}>
                <AdminHeader />
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
