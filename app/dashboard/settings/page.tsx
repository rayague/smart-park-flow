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
            toast.success("Profile updated successfully")
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error("Failed to update profile")
        } finally {
            setIsSaving(false)
        }
    }

    const sections = [
        {
            title: "Profile",
            icon: User,
            content: (
                <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input value={user?.email || ""} disabled />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input placeholder="+1 (555) 000-0000" disabled />
                        </div>
                    </div>
                    <Button
                        className="mt-4"
                        onClick={handleSaveProfile}
                        disabled={isSaving || name === user?.name}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            )
        },
        {
            title: "Notifications",
            icon: Bell,
            content: (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="font-medium">Push Notifications</label>
                            <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="font-medium">Email Updates</label>
                            <p className="text-sm text-muted-foreground">Receive booking confirmations and receipts</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <label className="font-medium">Marketing</label>
                            <p className="text-sm text-muted-foreground">Receive offers and promotions</p>
                        </div>
                        <Switch />
                    </div>
                </div>
            )
        },
        {
            title: "Payment Methods",
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
                        <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <Button variant="outline" className="w-full border-dashed gap-2">
                        <CreditCard className="h-4 w-4" />
                        Add New Card
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold">{t.userDashboard.navigation.settings}</h1>
                <p className="text-muted-foreground">Manage your account preferences and settings</p>
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
                            <h2 className="font-serif text-xl font-semibold">{section.title}</h2>
                        </div>
                        {section.content}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
