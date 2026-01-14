'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Car,
  Compass,
  CreditCard,
  FileText,
  HelpCircle,
  Linkedin,
  Mail,
  Megaphone,
  Newspaper,
  Phone,
  Shield,
  Smartphone,
  Sparkles,
  Twitter,
  Briefcase,
  Github,
  Info,
} from 'lucide-react';

import { useTranslation } from '@/hooks/useTranslation';

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' },
];

export default function AppFooter() {
  const { t, language } = useTranslation();

  const footerLinks = {
    product: [
      { label: t.footer.features, href: '/#features', icon: Sparkles },
      { label: t.footer.pricing, href: '/#pricing', icon: CreditCard },
      { label: language === 'fr' ? 'Emplacements' : 'Locations', href: '/parkings', icon: Compass },
      { label: language === 'fr' ? 'Application Mobile' : 'Mobile App', href: '/#mobile', icon: Smartphone },
    ],
    company: [
      { label: t.footer.about, href: '/#about', icon: Info },
      { label: t.footer.careers, href: '/#careers', icon: Briefcase },
      { label: t.footer.blog, href: '/#blog', icon: Newspaper },
      { label: language === 'fr' ? 'Presse' : 'Press', href: '/#press', icon: Megaphone },
    ],
    support: [
      { label: t.footer.helpCenter, href: '/#help', icon: HelpCircle },
      { label: t.footer.contact, href: '/#contact', icon: Phone },
      { label: language === 'fr' ? 'Confidentialité' : 'Privacy Policy', href: '/#privacy', icon: Shield },
      { label: language === 'fr' ? 'Conditions' : 'Terms of Service', href: '/#terms', icon: FileText },
    ],
  };

  return (
    <footer className="relative overflow-hidden">
      <div className="h-px w-full gradient-primary" />

      <div className="bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Car className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold">SmartPark</span>
              </Link>

              <p className="text-muted-foreground mb-6 max-w-sm">{t.footer.description}</p>

              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-10 w-10 rounded-xl glass flex items-center justify-center hover:bg-primary/10 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-display font-semibold mb-4">{t.footer.product}</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      <span className="inline-flex items-center gap-2">
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-display font-semibold mb-4">{t.footer.company}</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      <span className="inline-flex items-center gap-2">
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-display font-semibold mb-4">{t.footer.support}</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      <span className="inline-flex items-center gap-2">
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">© 2024 SmartPark. {t.footer.rights}</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                {language === 'fr' ? 'Tous les systèmes opérationnels' : 'All systems operational'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
