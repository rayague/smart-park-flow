"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import {
  MapPin,
  Zap,
  Clock,
  Shield,
  Smartphone,
  CreditCard,
  Car,
  Leaf
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface Feature {
  icon: React.ElementType
  titleKey: string
  descriptionKey: string
  gradient: string
}

const features: Feature[] = [
  {
    icon: MapPin,
    titleKey: "smartSearch",
    descriptionKey: "smartSearch",
    gradient: "from-primary to-blue-400",
  },
  {
    icon: Zap,
    titleKey: "evIntegration",
    descriptionKey: "evIntegration",
    gradient: "from-accent to-emerald-400",
  },
  {
    icon: Clock,
    titleKey: "realTimeUpdates",
    descriptionKey: "realTimeUpdates",
    gradient: "from-primary to-indigo-400",
  },
  {
    icon: Shield,
    titleKey: "securePayments",
    descriptionKey: "securePayments",
    gradient: "from-orange-400 to-rose-400",
  },
  {
    icon: Smartphone,
    titleKey: "smartReservations",
    descriptionKey: "smartReservations",
    gradient: "from-primary to-purple-400",
  },
  {
    icon: CreditCard,
    titleKey: "analytics",
    descriptionKey: "analytics",
    gradient: "from-accent to-teal-400",
  },
]

function FeatureCard({
  feature,
  index,
  t
}: {
  feature: Feature
  index: number
  t: ReturnType<typeof useTranslation>['t']
}) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const featureData = t.landing.featuresSection[feature.titleKey as keyof typeof t.landing.featuresSection]

  // Type guard to check if featureData has title and description
  const title = typeof featureData === 'object' && 'title' in featureData
    ? featureData.title
    : feature.titleKey
  const description = typeof featureData === 'object' && 'description' in featureData
    ? featureData.description
    : feature.descriptionKey

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative h-full rounded-2xl glass p-6 transition-all duration-300 hover:shadow-xl card-hover">
        {/* Icon */}
        <div className={cn(
          "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
          feature.gradient
        )}>
          <feature.icon className="h-6 w-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="mb-2 font-sans text-xl font-black uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Hover glow effect */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </motion.div>
  )
}

export function FeaturesSection() {
  const titleRef = React.useRef(null)
  const isTitleInView = useInView(titleRef, { once: true })
  const { t } = useTranslation()

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isTitleInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2"
          >
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t.nav.features}</span>
          </motion.div>

          <h2 className="mb-4 font-sans text-3xl font-black sm:text-4xl lg:text-5xl text-balance uppercase tracking-tighter">
            {t.landing.featuresSection.title}
          </h2>

          <p className="text-lg text-muted-foreground">
            {t.landing.featuresSection.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.titleKey} feature={feature} index={index} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
