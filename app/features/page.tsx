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
            title: "EV Charging Integration",
            description: "Seamlessly find and book spots with EV charging stations. Real-time availability updates for chargers.",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        },
        {
            icon: Shield,
            title: "Advanced Security",
            description: "24/7 surveillance and secure access control. Your vehicle's safety is our top priority.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Smartphone,
            title: "Mobile App Access",
            description: "Manage everything from your phone. Remote entry, booking extension, and contactless payments.",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            icon: Globe,
            title: "Smart Network",
            description: "Connected parking ecosystem across the city. Smart routing directs you to the nearest available spot.",
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            icon: Clock,
            title: "Predictive Analytics",
            description: "Know before you go. AI-powered occupancy predictions help you plan your trip better.",
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            icon: CreditCard,
            title: "Flexible Payments",
            description: "Pay as you go or subscribe. Support for all major cards, Apple Pay, and Google Pay.",
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
                    <h1 className="font-serif text-4xl font-bold sm:text-5xl mb-6">
                        Everything you need for <span className="text-gradient-primary">smarter parking</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Our platform combines cutting-edge technology with user-centric design to transform your parking experience.
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-2xl glass p-8 card-hover"
                        >
                            <div className={`h-14 w-14 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-3">{feature.title}</h3>
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
