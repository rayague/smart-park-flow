"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Download, Home, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { useRouter } from "next/navigation"

export function BookingConfirmation() {
    const { t } = useTranslation()
    const router = useRouter()

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10"
            >
                <CheckCircle2 className="h-12 w-12 text-green-500" />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-4 font-serif text-3xl font-bold"
            >
                {t.booking.confirmation.title}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8 max-w-md text-muted-foreground"
            >
                {t.booking.confirmation.message}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
            >
                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => router.push("/dashboard")}
                >
                    <Home className="h-4 w-4" />
                    {t.booking.confirmation.returnHome}
                </Button>
                <Button
                    className="gap-2"
                    onClick={() => window.print()}
                >
                    <Download className="h-4 w-4" />
                    {t.booking.confirmation.downloadReceipt}
                </Button>
                <Button
                    variant="secondary"
                    className="gap-2"
                >
                    <Calendar className="h-4 w-4" />
                    Add to Calendar
                </Button>
            </motion.div>
        </motion.div>
    )
}
