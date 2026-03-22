"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Car,
  Mail,
  MapPin,
  Phone,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Zap,
  Shield,
  HelpCircle,
  FileText,
  Lock
} from "lucide-react"
import { useTranslation } from "@/lib/i18n"

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Github, href: "#", label: "GitHub" },
]

export function Footer() {
  const { t } = useTranslation()

  const quickLinks = [
    { icon: Zap, label: t.nav.features, href: "#features" },
    { icon: MapPin, label: t.nav.parkings, href: "#parkings" },
    { icon: Shield, label: t.nav.pricing, href: "#pricing" },
  ]

  const supportLinks = [
    { icon: HelpCircle, label: t.landing.footer.helpCenter, href: "#" },
    { icon: Mail, label: t.landing.footer.contact, href: "#" },
    { icon: FileText, label: t.landing.footer.faq, href: "#" },
  ]

  const legalLinks = [
    { icon: FileText, label: t.landing.footer.terms, href: "#" },
    { icon: Lock, label: t.landing.footer.privacy, href: "#" },
  ]

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 glass-strong" />

      {/* Gradient decorative elements */}
      <div className="absolute -top-20 left-1/4 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="font-sans text-xl font-bold">
                Smart<span className="text-gradient-primary">Park</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              {t.landing.footer.description}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl glass hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h3 className="mb-4 font-semibold text-foreground">{t.landing.footer.quickLinks}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <link.icon className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="mb-4 font-semibold text-foreground">{t.landing.footer.support}</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <link.icon className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <h3 className="mb-4 font-semibold text-foreground">{t.landing.footer.legal}</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <link.icon className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <h3 className="mb-4 font-semibold text-foreground">{t.landing.footer.contact}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@smartpark.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Mail className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                  contact@smartpark.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Phone className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-6 border-t border-border/50"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SmartPark. {t.landing.footer.copyright}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground/60">
                {t.landing.footer.madeWith}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
