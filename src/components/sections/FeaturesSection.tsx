'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Zap, 
  Shield, 
  Clock, 
  CreditCard, 
  Leaf,
  ArrowRight 
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function FeaturesSection() {
  const { t, language } = useTranslation();

  const features = [
    {
      icon: MapPin,
      title: t.features.realTime,
      description: t.features.realTimeDesc,
      color: 'primary',
    },
    {
      icon: Zap,
      title: t.features.evCharging,
      description: t.features.evChargingDesc,
      color: 'secondary',
    },
    {
      icon: Shield,
      title: t.features.smartBooking,
      description: t.features.smartBookingDesc,
      color: 'primary',
    },
    {
      icon: Clock,
      title: t.features.securePayment,
      description: t.features.securePaymentDesc,
      color: 'secondary',
    },
    {
      icon: CreditCard,
      title: t.features.analytics,
      description: t.features.analyticsDesc,
      color: 'primary',
    },
    {
      icon: Leaf,
      title: t.features.mobileApp,
      description: t.features.mobileAppDesc,
      color: 'secondary',
    },
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-4">
            {t.features.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t.features.title}{' '}
            <span className="gradient-text">{t.features.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'De la recherche de place à la recharge de votre VE, nous vous accompagnons avec des technologies de pointe.'
              : 'From finding a spot to charging your EV, we\'ve got you covered with cutting-edge technology.'}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="h-full p-6 rounded-2xl glass card-hover cursor-pointer">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.color === 'primary' ? 'gradient-primary' : 'bg-secondary'
                  }`}
                >
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {language === 'fr' ? 'En savoir plus' : 'Learn more'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;
