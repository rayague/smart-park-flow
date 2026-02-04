"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Smartphone,
    Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/lib/i18n"

export default function ManagerSettingsPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                    {t.managerDashboard.navigation.settings}
                </h1>
                <p className="text-muted-foreground">
                    Customize your dashboard and manage your facility preferences.
                </p>
            </motion.div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="w-full justify-start glass overflow-x-auto h-auto p-1">
                    <TabsTrigger value="profile" className="gap-2 px-6 py-3">
                        <User className="h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2 px-6 py-3">
                        <Bell className="h-4 w-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2 px-6 py-3">
                        <Shield className="h-4 w-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="gap-2 px-6 py-3">
                        <CreditCard className="h-4 w-4" /> Billing
                    </TabsTrigger>
                    <TabsTrigger value="facility" className="gap-2 px-6 py-3">
                        <Smartphone className="h-4 w-4" /> Facility Apps
                    </TabsTrigger>
                </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl glass p-8 space-y-8"
                    >
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                                M
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-serif text-xl font-bold">Profile Picture</h3>
                                <p className="text-sm text-muted-foreground">Upload a new photo for your manager profile.</p>
                                <div className="flex gap-2 pt-2">
                                    <Button size="sm">Update Photo</Button>
                                    <Button size="sm" variant="ghost">Remove</Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue="John Manager" className="glass" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" defaultValue="manager@smartpark.com" disabled className="glass opacity-60" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" defaultValue="+33 6 12 34 56 78" className="glass" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name</Label>
                                <Input id="company" defaultValue="Smart Commercial Park Ltd" className="glass" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button className="gap-2">
                                <Save className="h-4 w-4" /> Save Changes
                            </Button>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl glass p-8 space-y-6"
                    >
                        <h3 className="font-serif text-xl font-bold">Notification Preferences</h3>
                        <p className="text-sm text-muted-foreground mb-6">Choose how you want to be notified about your parking activity.</p>

                        <div className="space-y-6">
                            {[
                                { title: "New Bookings", desc: "Receive an alert when a new spot is reserved." },
                                { title: "Maintenance Alerts", desc: "Notifications for equipment failure or spot issues." },
                                { title: "Revenue Reports", desc: "Weekly summaries of your parking performance." },
                                { title: "Security Alerts", desc: "Critical alerts for gate issues or unauthorized access." },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked={i % 2 === 0} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
