'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { Skeleton } from '@/components/ui/skeleton';
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

export default function ParkingsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['parkings'],
    queryFn: () => fetchJson<ParkingsResponse>('/api/parkings'),
  });

  const parkings = data?.items ?? [];

  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute -bottom-32 left-10 h-[520px] w-[520px] rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative">
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">Parkings</h1>
            <p className="text-muted-foreground max-w-2xl">
              Découvre les parkings intelligents autour de toi. (Liste + carte à brancher ensuite.)
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="rounded-2xl glass p-6 space-y-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ))
            : parkings.slice(0, 3).map((parking) => (
                <div key={parking.id} className="rounded-2xl glass p-6">
                  <div className="font-display text-xl font-bold mb-2">{parking.nameFr}</div>
                  <div className="text-muted-foreground">
                    {parking.available} places disponibles • {parking.hasEV ? 'EV ready' : 'Sans recharge'}
                  </div>
                </div>
              ))}
        </div>

        {isError && (
          <div className="mt-6 text-sm text-muted-foreground">
            Impossible de charger la liste des parkings pour le moment.
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md h-11 px-8 gradient-primary text-primary-foreground border-0"
          >
            Ouvrir le dashboard
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center rounded-md h-11 px-8 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            Voir les offres
          </Link>
        </div>
      </div>
    </main>
  );
}
