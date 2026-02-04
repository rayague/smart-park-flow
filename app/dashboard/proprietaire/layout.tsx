"use client"

import * as React from "react"
import { ManagerSidebar } from "@/components/manager/sidebar"
import { ManagerHeader } from "@/components/manager/header"
import { DashboardFooter } from "@/components/dashboard/footer"

export default function ProprietaireLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <ManagerSidebar />
            <div className="pl-64 flex-1 flex flex-col transition-all duration-300">
                <ManagerHeader />
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
