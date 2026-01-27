'use client';

import { useQuery } from '@tanstack/react-query';

import { Skeleton } from '@/components/ui/skeleton';
import { fetchJson } from '@/lib/api';

type ReservationsResponse = {
  items: Array<{
    id: string;
    status: string;
    parkingId?: string;
    startAt?: string;
    endAt?: string;
  }>;
};

export default function DashboardReservationsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => fetchJson<ReservationsResponse>('/api/reservations'),
  });

  const reservations = data?.items ?? [];

  return (
    <div className="rounded-2xl glass p-6">
      <div className="font-display text-2xl font-bold mb-2">Reservations</div>
      <div className="text-muted-foreground mb-6">Historique, modifications, annulations et extensions.</div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-xl bg-muted/50 p-4 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && reservations.length === 0 && (
        <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">Aucune réservation pour le moment.</div>
      )}

      {!isLoading && reservations.length > 0 && (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div key={r.id} className="rounded-xl bg-muted/50 p-4">
              <div className="font-medium">Reservation {r.id}</div>
              <div className="text-sm text-muted-foreground">Status: {r.status}</div>
            </div>
          ))}
        </div>
      )}

      {isError && <div className="mt-6 text-sm text-muted-foreground">Impossible de charger les réservations.</div>}
    </div>
  );
}
