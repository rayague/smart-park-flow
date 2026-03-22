"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Globe,
    Smartphone,
    Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useTranslation } from "@/lib/i18n"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function SettingsPage() {
    const { t } = useTranslation()
    const { user, updateUser } = useAuthStore()
    const [name, setName] = useState(user?.name || "")
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (user?.name) {
            setName(user.name)
        }
    }, [user?.name])

    const handleSaveProfile = async () => {
        if (!user) return
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ name })
                .eq('id', user.id)

            if (error) throw error

            updateUser({ name })
            toast.success(t.common.success || "Profile updated successfully")
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error(t.common.error || "Failed to update profile")
        } finally {
            setIsSaving(false)
        }
    }

    const sections = [
        {
            title: t.settings.sections.profile,
            icon: User,
            content: (
                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.settings.profile.name}</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t.settings.profile.name}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.settings.profile.email}</label>
                            <Input value={user?.email || ""} disabled />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.settings.profile.phone}</label>
                            <Input placeholder={t.settings.profile.phone} disabled />
                        </div>
                    </div>
                    <Button
                        className="mt-4 font-bold uppercase tracking-tight"
                        onClick={handleSaveProfile}
                        disabled={isSaving || name === user?.name}
                    >
                        {isSaving ? t.common.loading : t.common.save}
                    </Button>
                </div>
            )
        },
        {
            title: t.settings.sections.notifications,
            icon: Bell,
            content: (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="font-medium">{t.settings.notifications.push}</label>
                            <p className="text-sm text-muted-foreground">{t.settings.notifications.types.bookingReminders}</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="font-medium">{t.settings.notifications.email}</label>
                            <p className="text-sm text-muted-foreground">{t.settings.notifications.types.bookingConfirmation}</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="font-medium">{t.settings.notifications.types.promotions}</label>
                            <p className="text-sm text-muted-foreground">{t.settings.notifications.types.updates}</p>
                        </div>
                        <Switch />
                    </div>
                </div>
            )
        },
        {
            title: t.settings.sections.billing,
            icon: CreditCard,
            content: (
                <div className="space-y-4">
                    <div className="rounded-xl border border-border p-4 flex items-center justify-between bg-subtle">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-12 rounded bg-white flex items-center justify-center">
                                <span className="text-xs font-bold text-black">VISA</span>
                            </div>
                            <div>
                                <p className="font-medium">•••• 4242</p>
                                <p className="text-xs text-muted-foreground">Expires 12/28</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="font-bold uppercase tracking-tight">{t.common.edit}</Button>
                    </div>
                    <Button variant="outline" className="w-full border-dashed gap-2 font-bold uppercase tracking-tight">
                        <CreditCard className="h-4 w-4" />
                        {t.common.add}
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="font-heading text-3xl font-black tracking-tighter uppercase">{t.settings.title}</h1>
                <p className="text-muted-foreground">{t.userDashboard.navigation.settings}</p>
            </div>

            <div className="grid gap-8">
                {sections.map((section, index) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-2xl glass p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-box text-primary">
                                <section.icon className="h-5 w-5" />
                            </div>
                            <h2 className="font-bold text-xl uppercase tracking-tight">{section.title}</h2>
                        </div>
                        {section.content}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
