'use client';

import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export function PricingSection() {
  const { t, language } = useTranslation();

  const plans = [
    {
      name: t.pricing.plans.basic.name,
      description: t.pricing.plans.basic.description,
      price: language === 'fr' ? 'Gratuit' : 'Free',
      period: '',
      features: t.pricing.plans.basic.features,
      cta: t.pricing.getStarted,
      popular: false,
    },
    {
      name: t.pricing.plans.pro.name,
      description: t.pricing.plans.pro.description,
      price: '9,99€',
      period: t.pricing.perMonth,
      features: t.pricing.plans.pro.features,
      cta: language === 'fr' ? 'Essai Gratuit' : 'Start Free Trial',
      popular: true,
    },
    {
      name: t.pricing.plans.enterprise.name,
      description: t.pricing.plans.enterprise.description,
      price: '49,99€',
      period: t.pricing.perMonth,
      features: t.pricing.plans.enterprise.features,
      cta: t.pricing.contactSales,
      popular: false,
    },
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-4">
            {t.pricing.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t.pricing.title}{' '}
            <span className="gradient-text">{t.pricing.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Choisissez le plan adapté à vos besoins. Sans frais cachés, annulez quand vous voulez.'
              : 'Choose the plan that fits your parking needs. No hidden fees, cancel anytime.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? 'gradient-border bg-card'
                  : 'glass'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full gradient-primary text-primary-foreground text-sm font-medium">
                    <Zap className="h-4 w-4" />
                    {t.pricing.popular}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="font-display text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-secondary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? 'gradient-primary text-primary-foreground border-0'
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
