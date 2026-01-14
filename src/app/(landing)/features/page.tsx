export default function FeaturesPage() {
  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
          <div className="absolute -top-24 left-10 h-[520px] w-[520px] rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute -bottom-32 right-10 h-[520px] w-[520px] rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative">
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">Features</h1>
            <p className="text-muted-foreground max-w-2xl">
              Tout ce qu’il faut pour réserver, gérer, et payer le parking au même endroit.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Real-time availability</div>
            <div className="text-muted-foreground">Données live et prédiction de remplissage.</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Instant booking</div>
            <div className="text-muted-foreground">Réservation en 2 taps, confirmation immédiate.</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">EV charging</div>
            <div className="text-muted-foreground">Bornes, sessions, facturation unifiée.</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Seamless payments</div>
            <div className="text-muted-foreground">Cartes, factures, et remboursements.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
