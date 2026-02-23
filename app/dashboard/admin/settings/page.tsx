"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
    Settings as SettingsIcon,
    Shield,
    Globe,
    Database,
    AlertTriangle,
    Save,
    Lock,
    Key,
    Server,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/lib/i18n"

export default function AdminSettingsPage() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                    {t.adminDashboard.navigation.settings}
                </h1>
                <p className="text-muted-foreground">
                    Global platform configuration, security policies, and system monitoring.
                </p>
            </motion.div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="w-full justify-start glass overflow-x-auto h-auto p-1">
                    <TabsTrigger value="general" className="gap-2 px-6 py-3">
                        <Globe className="h-4 w-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2 px-6 py-3">
                        <Lock className="h-4 w-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="api" className="gap-2 px-6 py-3">
                        <Key className="h-4 w-4" /> API & Integrations
                    </TabsTrigger>
                    <TabsTrigger value="system" className="gap-2 px-6 py-3">
                        <Server className="h-4 w-4" /> System Health
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl glass p-8 space-y-8"
                    >
                        <h3 className="font-serif text-xl font-bold">Platform Configuration</h3>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="platformName">Platform Name</Label>
                                <Input id="platformName" defaultValue="SmartPark Global" className="glass" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="supportEmail">Global Support Email</Label>
                                <Input id="supportEmail" defaultValue="admin@smartpark.com" className="glass" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Maintenance Mode</h4>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                                <div className="space-y-1">
                                    <p className="font-bold flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" /> Platform Maintenance
                                    </p>
                                    <p className="text-sm text-muted-foreground">When enabled, only admins can access the platform.</p>
                                </div>
                                <Switch />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button className="gap-2 bg-gradient-to-r from-red-500 to-orange-500">
                                <Save className="h-4 w-4" /> Save Global Settings
                            </Button>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl glass p-8 space-y-6"
                    >
                        <h3 className="font-serif text-xl font-bold text-red-500">Security Policies</h3>

                        <div className="space-y-6">
                            {[
                                { title: "Two-Factor Auth Required", desc: "Require 2FA for all manager and admin accounts.", checked: true },
                                { title: "Session Timeout", desc: "Automatically log out inactive users after 30 minutes.", checked: true },
                                { title: "New Manager Approval", desc: "Manually verify all new manager accounts before activation.", checked: true },
                                { title: "API IP Whitelisting", desc: "Restrict API access to verified IP addresses only.", checked: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked={item.checked} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </TabsContent>

                {/* System Health */}
                <TabsContent value="system">
                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { label: "API Status", value: "Operational", status: "ok", icon: Zap },
                            { label: "Database", value: "Healthy", status: "ok", icon: Database },
                            { label: "Storage", value: "85% Used", status: "warning", icon: Server },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="rounded-2xl glass p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg ${item.status === 'ok' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div className={`h-2 w-2 rounded-full animate-pulse ${item.status === 'ok' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                </div>
                                <p className="text-sm text-muted-foreground">{item.label}</p>
                                <p className="text-xl font-bold">{item.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
