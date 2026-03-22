"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Zap, Shield, Smartphone, Globe, Clock, CreditCard } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { useTranslation } from "@/lib/i18n"

export default function FeaturesPage() {
    const { t } = useTranslation()

    const features = [
        {
            icon: Zap,
            title: t.landing.featuresSection.evIntegration.title,
            description: t.landing.featuresSection.evIntegration.description,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        },
        {
            icon: Shield,
            title: t.landing.featuresSection.securePayments.title,
            description: t.landing.featuresSection.securePayments.description,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Smartphone,
            title: t.landing.featuresSection.smartReservations.title,
            description: t.landing.featuresSection.smartReservations.description,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            icon: Globe,
            title: "Réseau Intelligent",
            description: "Un écosystème de stationnement connecté dans toute la ville. Le routage intelligent vous dirige vers la place disponible la plus proche.",
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            icon: Clock,
            title: t.landing.featuresSection.realTimeUpdates.title,
            description: t.landing.featuresSection.realTimeUpdates.description,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            icon: CreditCard,
            title: t.landing.featuresSection.analytics.title,
            description: t.landing.featuresSection.analytics.description,
            color: "text-cyan-500",
            bg: "bg-cyan-500/10"
        }
    ]

    return (
        <div className="min-h-screen relative overflow-hidden">

            <Header />

            <main className="container mx-auto px-4 py-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="font-sans text-4xl font-black uppercase tracking-tighter sm:text-5xl lg:text-6xl mb-6">
                        {t.landing.featuresSection.title}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {t.landing.featuresSection.subtitle}
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-3xl glass p-8 card-hover border-white/10"
                        >
                            <div className={`h-16 w-16 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-8 shadow-inner`}>
                                <feature.icon className="h-8 w-8" />
                            </div>
                            <h3 className="font-sans text-xl font-black uppercase tracking-tight mb-4">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}
