'use client';

import { motion } from 'framer-motion';
import { Typewriter } from '@/components/animations/Typewriter';
import CommandBarSearch from '@/components/search/CommandBarSearch';
import { useTranslation } from '@/hooks/useTranslation';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background dark:from-transparent dark:via-background/20 dark:to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/60 dark:to-transparent pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center justify-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <Typewriter
              className="gradient-text font-display font-bold text-[clamp(1.6rem,6vw,4.25rem)] leading-none whitespace-nowrap"
              texts={[...t.hero.typingPhrases]}
              speed={80}
              deleteSpeed={40}
              pauseDuration={2500}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <CommandBarSearch />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
