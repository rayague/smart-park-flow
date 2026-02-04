"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    UserPlus,
    Car,
    CreditCard,
    AlertTriangle,
    CheckCircle2,
    Clock
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Activity {
    id: string
    type: "user_signup" | "booking" | "payment" | "alert" | "verification"
    message: string
    time: string
    user?: string
    icon: React.ElementType
    color: string
}

const activities: Activity[] = [
    {
        id: "1",
        type: "user_signup",
        message: "New user registered",
        time: "2 min ago",
        user: "Marie Dupont",
        icon: UserPlus,
        color: "text-blue-500 bg-blue-500/10",
    },
    {
        id: "2",
        type: "booking",
        message: "New booking completed",
        time: "5 min ago",
        user: "Jean Martin",
        icon: Car,
        color: "text-green-500 bg-green-500/10",
    },
    {
        id: "3",
        type: "payment",
        message: "Payment received",
        time: "12 min ago",
        user: "$45.00 from Pierre L.",
        icon: CreditCard,
        color: "text-emerald-500 bg-emerald-500/10",
    },
    {
        id: "4",
        type: "alert",
        message: "Parking at capacity",
        time: "18 min ago",
        user: "Parking Centre-Ville",
        icon: AlertTriangle,
        color: "text-yellow-500 bg-yellow-500/10",
    },
    {
        id: "5",
        type: "verification",
        message: "Manager verified",
        time: "25 min ago",
        user: "Sophie Leroy",
        icon: CheckCircle2,
        color: "text-purple-500 bg-purple-500/10",
    },
    {
        id: "6",
        type: "booking",
        message: "Booking extended",
        time: "32 min ago",
        user: "Marc Bernard",
        icon: Clock,
        color: "text-orange-500 bg-orange-500/10",
    },
]

export function ActivityFeed() {
    const { t } = useTranslation()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl glass p-6"
        >
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold">
                    {t.adminDashboard.sections.userActivity}
                </h3>
                <button className="text-sm text-primary hover:underline">
                    {t.common.viewAll}
                </button>
            </div>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="flex items-start gap-3"
                    >
                        <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${activity.color}`}>
                            <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{activity.message}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                {activity.user}
                            </p>
                        </div>
                        <span className="flex-shrink-0 text-xs text-muted-foreground">
                            {activity.time}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
