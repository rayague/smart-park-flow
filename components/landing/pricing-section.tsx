"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { Check, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Basic",
    description: "Perfect for occasional parkers",
    price: "0",
    period: "forever",
    features: [
      "Find nearby parking spots",
      "Basic navigation",
      "Pay as you go",
      "Email support",
      "Standard availability updates",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Premium",
    description: "Best for daily commuters",
    price: "9.99",
    period: "month",
    features: [
      "Everything in Basic",
      "Priority reservations",
      "EV charging discounts",
      "Real-time availability",
      "24/7 phone support",
      "No booking fees",
      "Parking history analytics",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    description: "For teams and companies",
    price: "49.99",
    period: "month",
    features: [
      "Everything in Premium",
      "Unlimited team members",
      "Fleet management",
      "Expense reporting",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

function PricingCard({ 
  plan, 
  index 
}: { 
  plan: typeof plans[0]
  index: number 
}) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative rounded-2xl p-1",
        plan.popular && "bg-gradient-to-b from-primary to-accent"
      )}
    >
      <div className={cn(
        "relative h-full rounded-xl p-6",
        plan.popular 
          ? "bg-card" 
          : "glass"
      )}>
        {/* Popular Badge */}
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
            >
              <Star className="h-3 w-3 fill-current" />
              Most Popular
            </motion.div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="mb-1 font-serif text-xl font-semibold">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>

        {/* Price */}
        <div className="mb-6 text-center">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.period}</span>
        </div>

        {/* Features */}
        <ul className="mb-6 space-y-3">
          {plan.features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-start gap-2 text-sm"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="text-muted-foreground">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          className={cn(
            "w-full",
            plan.popular 
              ? "bg-primary glow-primary-sm" 
              : "bg-secondary hover:bg-secondary/80"
          )}
        >
          {plan.cta}
        </Button>
      </div>
    </motion.div>
  )
}

export function PricingSection() {
  const titleRef = React.useRef(null)
  const isTitleInView = useInView(titleRef, { once: true })

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isTitleInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
          >
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Pricing</span>
          </motion.div>
          
          <h2 className="mb-4 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl text-balance">
            Simple, transparent <span className="text-gradient-primary">pricing</span>
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your parking needs. 
            All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-12 max-w-2xl rounded-2xl glass p-8 text-center"
        >
          <h3 className="mb-2 font-serif text-xl font-semibold">
            Need a custom solution?
          </h3>
          <p className="mb-4 text-muted-foreground">
            Contact us for enterprise plans with custom pricing, dedicated support, 
            and tailored features for your organization.
          </p>
          <Button variant="outline" className="gap-2 bg-transparent">
            Contact Enterprise Sales
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
