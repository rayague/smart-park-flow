"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Users, Target, Shield, History } from "lucide-react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { useTranslation } from "@/lib/i18n"
import Image from "next/image"

export default function AboutPage() {
    const { t } = useTranslation()

    const stats = [
        { label: "Founded", value: "2024" },
        { label: "Cities", value: "15+" },
        { label: "Active Users", value: "50k+" },
        { label: "Parkings", value: "500+" },
    ]

    const values = [
        {
            icon: Target,
            title: "Our Mission",
            description: "To revolutionize urban mobility by making parking effortless, sustainable, and efficient for everyone."
        },
        {
            icon: Users,
            title: "Community First",
            description: "We build with people in mind. Creating safe, accessible spaces that serve the local community."
        },
        {
            icon: Shield,
            title: "Trust & Safety",
            description: "Your security is paramount. We verify every location and ensure secure transactions."
        },
        {
            icon: History,
            title: "Innovation",
            description: "Constantly pushing boundaries with AI, IoT, and smart city integrations."
        }
    ]

    return (
        <div className="min-h-screen relative overflow-hidden">

            <Header />

            <main className="container mx-auto px-4 py-32 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h1 className="font-serif text-4xl font-bold sm:text-5xl mb-6">
                        We are <span className="text-gradient-primary">SmartPark</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Building the digital infrastructure for the future of urban parking.
                        We connect drivers with the perfect spot, reducing traffic and emissions one park at a time.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center p-6 rounded-2xl glass"
                        >
                            <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Values Grid */}
                <div className="grid gap-8 md:grid-cols-2 mb-20">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="p-8 rounded-2xl glass flex gap-6"
                        >
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary">
                                <value.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Team Section (Placeholder) */}
                <div className="text-center">
                    <h2 className="font-serif text-3xl font-bold mb-12">Meet the Team</h2>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl glass aspect-[3/4]">
                                <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
                                    <span className="text-muted-foreground">Photo {i}</span>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                                    <p className="font-bold">Team Member {i}</p>
                                    <p className="text-sm text-muted-foreground">Role</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
