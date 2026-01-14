import Link from 'next/link';

export default function DiscoverPage() {
  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
          <div className="absolute -top-28 -right-28 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative">
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">Discover</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore la ville, compare les disponibilités, et réserve en quelques secondes.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Search</div>
            <div className="text-muted-foreground">Zones, prix, bornes EV, horaires.</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Map</div>
            <div className="text-muted-foreground">Visualise en temps réel autour de toi.</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Book</div>
            <div className="text-muted-foreground">Paiement et accès sans friction.</div>
          </div>
        </div>

        <div className="mt-8 flex gap-3 flex-wrap">
          <Link
            href="/parkings"
            className="inline-flex items-center justify-center rounded-md h-11 px-8 gradient-primary text-primary-foreground border-0"
          >
            Voir les parkings
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md h-11 px-8 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            Voir les offres
          </Link>
        </div>
      </div>
    </main>
  );
}
