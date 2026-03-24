"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useTranslation } from "@/lib/i18n"
import { useAuthStore } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

function PaymentSection() {
    const { toast } = useToast()
    const [editing, setEditing] = React.useState(false)
    const [cardNumber, setCardNumber] = React.useState("•••• •••• •••• 4242")
    const [expiry, setExpiry] = React.useState("12/28")

    const handleSaveCard = () => {
        setEditing(false)
        toast({ title: "Card updated", description: "Your payment method has been saved." })
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-border p-4 flex items-center justify-between bg-subtle">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-12 rounded bg-white flex items-center justify-center">
                        <span className="text-xs font-bold text-black">VISA</span>
                    </div>
                    {editing ? (
                        <div className="flex gap-2">
                            <Input
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value)}
                                placeholder="Card number"
                                className="h-8 w-40 text-sm"
                            />
                            <Input
                                value={expiry}
                                onChange={e => setExpiry(e.target.value)}
                                placeholder="MM/YY"
                                className="h-8 w-20 text-sm"
                            />
                        </div>
                    ) : (
                        <div>
                            <p className="font-medium">{cardNumber.slice(-9)}</p>
                            <p className="text-xs text-muted-foreground">Expires {expiry}</p>
                        </div>
                    )}
                </div>
                {editing ? (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleSaveCard}>Save</Button>
                    </div>
                ) : (
                    <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                )}
            </div>
            <Button
                variant="outline"
                className="w-full border-dashed gap-2"
                onClick={() => {
                    toast({
                        title: "Coming soon",
                        description: "Adding additional payment methods will be available soon.",
                    })
                }}
            >
                <CreditCard className="h-4 w-4" />
                Add New Card
            </Button>
        </div>
    )
}

function NotificationSection() {
    const [pushEnabled, setPushEnabled] = React.useState(true)
    const [emailEnabled, setEmailEnabled] = React.useState(true)
    const { toast } = useToast()

    const handleToggle = (type: string, value: boolean) => {
        if (type === "push") setPushEnabled(value)
        else setEmailEnabled(value)
        toast({
            title: `${type === "push" ? "Push" : "Email"} notifications ${value ? "enabled" : "disabled"}`,
            description: value ? "You will receive notifications." : "Notifications turned off.",
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <label className="font-medium">Push Notifications</label>
                    <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
                </div>
                <Switch checked={pushEnabled} onCheckedChange={(v) => handleToggle("push", v)} />
            </div>
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <label className="font-medium">Email Updates</label>
                    <p className="text-sm text-muted-foreground">Receive booking confirmations and receipts</p>
                </div>
                <Switch checked={emailEnabled} onCheckedChange={(v) => handleToggle("email", v)} />
            </div>
        </div>
    )
}

function ProfileSection() {
    const { user, updateUser } = useAuthStore()
    const { t } = useTranslation()
    const { toast } = useToast()
    const [name, setName] = React.useState(user?.name || "")
    const [phone, setPhone] = React.useState("")
    const [saving, setSaving] = React.useState(false)

    React.useEffect(() => {
        if (!user) return
        const load = async () => {
            const { data } = await supabase.from("profiles").select("phone").eq("id", user.id).single()
            if (data?.phone) setPhone(data.phone)
        }
        load()
    }, [user])

    const handleSave = async () => {
        if (!user) return
        setSaving(true)
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ name, phone, updated_at: new Date().toISOString() })
                .eq("id", user.id)

            if (error) throw error
            updateUser({ name })
            toast({ title: t.common.success, description: "Profile updated!" })
        } catch (e: any) {
            toast({ title: t.common.error, description: e.message, variant: "destructive" })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue={user?.email || ""} disabled />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                </div>
            </div>
            <Button className="mt-4" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
    )
}

export default function ClientSettingsPage() {
    const { t } = useTranslation()
    const { user } = useAuthStore()

    const sections = [
        {
            title: "Profile",
            icon: User,
            content: <ProfileSection />
        },
        {
            title: "Notifications",
            icon: Bell,
            content: <NotificationSection />
        },
        {
            title: "Payment Methods",
            icon: CreditCard,
            content: <PaymentSection />
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
