'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { ParkingGallery } from '@/components/sections/ParkingGallery';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { CTASection } from '@/components/sections/CTASection';

export default function LandingPageClient() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ParkingGallery />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
