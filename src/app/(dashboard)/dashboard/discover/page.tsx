'use client';

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

export default function DashboardDiscoverPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['parkings'],
    queryFn: () => fetchJson<ParkingsResponse>('/api/parkings'),
  });

  const parkings = data?.items ?? [];

  return (
    <div className="rounded-2xl glass p-6">
      <div className="font-display text-2xl font-bold mb-2">Find Parking</div>
      <div className="text-muted-foreground mb-6">Recherche, filtres, carte et disponibilité en temps réel.</div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-xl bg-muted/50 p-4 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : parkings.map((p) => (
              <div key={p.id} className="rounded-xl bg-muted/50 p-4">
                <div className="font-medium mb-1">{p.nameFr}</div>
                <div className="text-sm text-muted-foreground">{p.locationFr}</div>
                <div className="mt-3 text-sm">
                  <span className="font-medium text-primary">{p.priceFr}</span>
                  <span className="text-muted-foreground"> • {p.available} places</span>
                  <span className="text-muted-foreground"> • {p.hasEV ? 'EV' : 'No EV'}</span>
                </div>
              </div>
            ))}
      </div>

      {isError && <div className="mt-6 text-sm text-muted-foreground">Impossible de charger les parkings.</div>}
    </div>
  );
}
