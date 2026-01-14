import Link from 'next/link';

export default function ParkingsPage() {
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
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Centre-ville</div>
            <div className="text-muted-foreground">42 places disponibles • EV ready</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Aéroport</div>
            <div className="text-muted-foreground">16 places disponibles • Longue durée</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Tech Hub</div>
            <div className="text-muted-foreground">73 places disponibles • Accès rapide</div>
          </div>
        </div>

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
