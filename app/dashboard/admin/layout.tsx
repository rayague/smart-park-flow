"use client"

import * as React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { DashboardFooter } from "@/components/dashboard/footer"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
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
