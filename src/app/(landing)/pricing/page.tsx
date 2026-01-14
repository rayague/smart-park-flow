import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute -bottom-32 right-10 h-[520px] w-[520px] rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative">
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">Pricing</h1>
            <p className="text-muted-foreground max-w-2xl">
              Des offres simples, transparentes, et prêtes pour l’échelle.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl glass p-6">
            <div className="text-sm text-muted-foreground">Starter</div>
            <div className="font-display text-3xl font-bold mt-2">€9</div>
            <div className="text-muted-foreground">/ mois</div>
          </div>
          <div className="rounded-2xl glass-strong p-6 border border-primary/30">
            <div className="text-sm text-muted-foreground">Pro</div>
            <div className="font-display text-3xl font-bold mt-2">€19</div>
            <div className="text-muted-foreground">/ mois</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="text-sm text-muted-foreground">Business</div>
            <div className="font-display text-3xl font-bold mt-2">€49</div>
            <div className="text-muted-foreground">/ mois</div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md h-11 px-8 gradient-primary text-primary-foreground border-0"
          >
            Commencer
          </Link>
        </div>
      </div>
    </main>
  );
}
