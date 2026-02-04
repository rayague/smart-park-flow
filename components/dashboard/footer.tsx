"use client"

import * as React from "react"
import { useTranslation } from "@/lib/i18n"

export function DashboardFooter() {
    const { t } = useTranslation()

    return (
        <footer className="mt-auto py-6 border-t border-border/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                <p>© {new Date().getFullYear()} SmartPark. {t.landing.footer.copyright}</p>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary transition-colors">Support</a>
                </div>
            </div>
        </footer>
    )
}
