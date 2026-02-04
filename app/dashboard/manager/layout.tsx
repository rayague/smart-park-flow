"use client"

import * as React from "react"
import { ManagerSidebar } from "@/components/manager/sidebar"
import { ManagerHeader } from "@/components/manager/header"

export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
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
