"use client"

import * as React from "react"
import { ManagerSidebar } from "@/components/manager/sidebar"
import { ManagerHeader } from "@/components/manager/header"
import { useAuthStore, useTranslation } from "@/lib/store"
import { AuthLoadingOverlay } from "@/components/auth/auth-loading-overlay"

export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isLoading } = useAuthStore()
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-background">
            <AuthLoadingOverlay isLoading={isLoading} message={t.common.loading} />
            <ManagerSidebar />
            <div className="pl-64 transition-all duration-300">
                <ManagerHeader />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
