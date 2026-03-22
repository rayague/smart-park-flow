"use client"

import * as React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { DashboardFooter } from "@/components/dashboard/footer"
import { useAuthStore, useTranslation } from "@/lib/store"
import { AuthLoadingOverlay } from "@/components/auth/auth-loading-overlay"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isLoading } = useAuthStore()
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AuthLoadingOverlay isLoading={isLoading} message={t.common.loading} />
            <AdminSidebar />
            <div className="pl-64 flex-1 flex flex-col transition-all duration-300">
                <AdminHeader />
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
