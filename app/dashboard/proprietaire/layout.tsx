"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ManagerSidebar } from "@/components/manager/sidebar"
import { ManagerHeader } from "@/components/manager/header"
import { DashboardFooter } from "@/components/dashboard/footer"

export default function ProprietaireLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname() || "/dashboard/proprietaire"
    const router = useRouter()

    React.useEffect(() => {
        const nextPath = pathname.replace(/^\/dashboard\/proprietaire/, "/dashboard/manager")
        if (nextPath !== pathname) {
            router.replace(nextPath)
        }
    }, [pathname, router])

    if (pathname.startsWith("/dashboard/proprietaire")) {
        return null
    }

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
