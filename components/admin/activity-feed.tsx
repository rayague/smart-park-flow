"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    UserPlus,
    Car,
    CreditCard,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Info
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

interface Activity {
    id: string
    type: "user_signup" | "booking" | "payment" | "alert" | "verification" | "info"
    message: string
    time: string
    user?: string
    icon: React.ElementType
    color: string
}

const iconMap: Record<string, React.ElementType> = {
    user_signup: UserPlus,
    booking: Car,
    payment: CreditCard,
    alert: AlertTriangle,
    verification: CheckCircle2,
    info: Info,
}

const colorMap: Record<string, string> = {
    user_signup: "text-blue-500 bg-blue-500/10",
    booking: "text-green-500 bg-green-500/10",
    payment: "text-emerald-500 bg-emerald-500/10",
    alert: "text-yellow-500 bg-yellow-500/10",
    verification: "text-purple-500 bg-purple-500/10",
    info: "text-gray-500 bg-gray-500/10",
}

export function ActivityFeed() {
    const { t } = useTranslation()
    const [activities, setActivities] = React.useState<Activity[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        async function fetchActivities() {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10)

            if (error) {
                console.error('Failed to fetch activities:', error)
                setActivities([])
            } else {
                const mapped: Activity[] = (data || []).map((n: any) => ({
                    id: n.id,
                    type: (n.type || 'info') as Activity['type'],
                    message: n.title || 'Notification',
                    time: n.created_at 
                        ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true })
                        : 'Just now',
                    user: n.message || '',
                    icon: iconMap[n.type || 'info'] || Info,
                    color: colorMap[n.type || 'info'] || colorMap.info,
                }))
                setActivities(mapped)
            }
            setLoading(false)
        }

        fetchActivities()
    }, [])

    if (loading) {
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
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className="mt-0.5 h-8 w-8 rounded-lg bg-muted animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                                <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        )
    }

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
                <button className="text-sm text-primary hover:underline cursor-pointer">
                    {t.common.viewAll}
                </button>
            </div>

            <div className="space-y-4">
                {activities.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        No recent activity
                    </div>
                ) : (
                    activities.map((activity, index) => (
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
                    ))
                )}
            </div>
        </motion.div>
    )
}
