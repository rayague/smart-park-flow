export default function CareersPage() {
  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
          <div className="absolute -top-24 left-10 h-[520px] w-[520px] rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute -bottom-32 right-10 h-[520px] w-[520px] rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative">
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">Careers</h1>
            <p className="text-muted-foreground max-w-2xl">
              On construit le futur du stationnement intelligent. Postes ouverts bientôt.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
