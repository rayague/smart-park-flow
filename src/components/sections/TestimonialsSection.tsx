'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const testimonials = {
  en: [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Daily Commuter',
      avatar: 'SJ',
      content: 'SmartPark has completely changed how I approach parking. I save at least 20 minutes every day not circling around looking for spots.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'EV Owner',
      avatar: 'MC',
      content: 'The EV charging integration is seamless. I can find charging spots, book them in advance, and never worry about running out of battery.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Business Owner',
      avatar: 'ER',
      content: 'Managing our fleet parking has never been easier. The analytics and expense tracking features are invaluable for our business.',
      rating: 5,
    },
  ],
  fr: [
    {
      id: 1,
      name: 'Marie Dupont',
      role: 'Navetteur Quotidien',
      avatar: 'MD',
      content: 'SmartPark a complètement changé ma façon de me garer. J\'économise au moins 20 minutes par jour à ne plus chercher de place.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Pierre Martin',
      role: 'Propriétaire VE',
      avatar: 'PM',
      content: 'L\'intégration de la recharge VE est parfaite. Je trouve des bornes, je réserve à l\'avance, et je ne m\'inquiète plus jamais de la batterie.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      role: 'Chef d\'Entreprise',
      avatar: 'SB',
      content: 'Gérer le stationnement de notre flotte n\'a jamais été aussi simple. Les analyses et le suivi des dépenses sont inestimables.',
      rating: 5,
    },
  ],
};

export function TestimonialsSection() {
  const { t, language } = useTranslation();
  const currentTestimonials = testimonials[language];

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-4">
            {t.testimonials.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t.testimonials.title}{' '}
            <span className="gradient-text">{t.testimonials.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Rejoignez des milliers d\'utilisateurs satisfaits qui ont transformé leur expérience de stationnement.'
              : 'Join thousands of satisfied users who\'ve transformed their parking experience.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {currentTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl glass card-hover"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-primary/30" />
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
