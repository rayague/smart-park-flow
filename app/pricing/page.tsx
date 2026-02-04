"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export default function PricingPage() {
    const { t } = useTranslation()
    const [billing, setBilling] = React.useState<"monthly" | "yearly">("monthly")

    const plans = [
        {
            name: "Basic",
            price: billing === "monthly" ? 0 : 0,
            description: "Perfect for occasional parking needs",
            features: [
                "Pay-as-you-go parking",
                "Basic spot reservation",
                "Mobile app access",
                "Standard support",
            ],
            notIncluded: [
                "Priority spots",
                "EV charging discounts",
                "Valet service",
            ]
        },
        {
            name: "Pro",
            price: billing === "monthly" ? 29 : 290,
            popular: true,
            description: "For daily commuters and frequent users",
            features: [
                "10% off hourly rates",
                "Priority spot reservation",
                "EV charging included (2h/day)",
                "Premium support 24/7",
                "Free cancellation",
            ],
            notIncluded: [
                "Valet service",
            ]
        },
        {
            name: "Enterprise",
            price: billing === "monthly" ? 99 : 990,
            description: "Complete solution for businesses",
            features: [
                "Dedicated corporate spots",
                "Unlimited EV charging",
                "Valet service included",
                "Dedicated account manager",
                "Fleet management dashboard",
                "API access",
            ],
            notIncluded: []
        }
    ]

    return (
        <div className="min-h-screen relative overflow-hidden">

            <Header />

            <main className="container mx-auto px-4 py-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-12"
                >
                    <h1 className="font-serif text-4xl font-bold sm:text-5xl mb-6">
                        Simple, transparent <span className="text-gradient-primary">pricing</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Choose the specific plan that fits your parking needs. No hidden fees.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={cn("text-sm font-medium", billing === "monthly" ? "text-primary" : "text-muted-foreground")}>Monthly</span>
                        <button
                            onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
                            className="relative h-7 w-12 rounded-full bg-secondary transition-colors hover:bg-secondary/80"
                        >
                            <motion.div
                                className="absolute top-1 left-1 h-5 w-5 rounded-full bg-primary"
                                animate={{ x: billing === "monthly" ? 0 : 20 }}
                            />
                        </button>
                        <span className={cn("text-sm font-medium", billing === "yearly" ? "text-primary" : "text-muted-foreground")}>
                            Yearly <span className="text-xs text-accent font-normal">(Save 15%)</span>
                        </span>
                    </div>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative rounded-2xl p-8 card-hover flex flex-col",
                                plan.popular ? "glass-strong border-primary/50" : "glass"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 py-1 px-3 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="font-serif text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">${plan.price}</span>
                                    <span className="text-muted-foreground">/{billing === "monthly" ? "mo" : "yr"}</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3 text-sm">
                                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                                {plan.notIncluded.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/50">
                                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                className="w-full"
                            >
                                Get Started
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}
