export default function AboutPage() {
  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
          <div className="absolute -top-28 -right-28 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative">
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">About</h1>
            <p className="text-muted-foreground max-w-2xl">
              SmartPark transforme le parking urbain en expérience fluide : disponibilité temps réel, réservation instantanée,
              et paiements sans friction.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Vision</div>
            <div className="text-muted-foreground">Moins de temps perdu, plus de ville.</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Tech</div>
            <div className="text-muted-foreground">Capteurs, données et UX premium.</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Trust</div>
            <div className="text-muted-foreground">Sécurité, transparence, conformité.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
