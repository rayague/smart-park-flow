'use client';

import { motion } from 'framer-motion';
import { MapPin, Zap, Star, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchJson } from '@/lib/api';

type ParkingItem = {
  id: string;
  nameEn: string;
  nameFr: string;
  locationEn: string;
  locationFr: string;
  image: string;
  rating: number;
  priceEn: string;
  priceFr: string;
  hasEV: boolean;
  available: number;
};

type ParkingsResponse = {
  items: ParkingItem[];
};

export function ParkingGallery() {
  const { t, language } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['parkings'],
    queryFn: () => fetchJson<ParkingsResponse>('/api/parkings'),
  });

  const parkings = data?.items ?? [];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-4">
            {t.gallery.badge}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {t.gallery.title}{' '}
            <span className="gradient-text">{t.gallery.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Découvrez notre sélection de parkings modernes et sécurisés à travers la ville.'
              : 'Browse our curated selection of modern, secure parking facilities across the city.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative rounded-2xl overflow-hidden card-hover"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <Skeleton className="w-full h-full rounded-none" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex items-center justify-between pt-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </div>
                </motion.div>
              ))
            : parkings.map((parking, index) => (
            <motion.div
              key={parking.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden card-hover cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={parking.image}
                  alt={language === 'fr' ? parking.nameFr : parking.nameEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80" />

              {/* EV Badge */}
              {parking.hasEV && (
                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                  <Zap className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display text-lg font-bold mb-1">
                      {language === 'fr' ? parking.nameFr : parking.nameEn}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {language === 'fr' ? parking.locationFr : parking.locationEn}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-background/50 backdrop-blur-sm">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium">{parking.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-lg font-bold text-primary">
                      {language === 'fr' ? parking.priceFr : parking.priceEn}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {parking.available} {language === 'fr' ? 'places' : 'spots'}
                    </span>
                  </div>
                  <Button size="sm" className="gradient-primary text-primary-foreground border-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.gallery.bookNow}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {isError && (
          <div className="text-center mt-8 text-sm text-muted-foreground">
            {language === 'fr'
              ? 'Impossible de charger les parkings pour le moment.'
              : 'Unable to load parkings right now.'}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="gap-2">
            {language === 'fr' ? 'Voir Tous les Emplacements' : 'View All Locations'}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default ParkingGallery;
