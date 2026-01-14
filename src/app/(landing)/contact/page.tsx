import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
          <div className="absolute -top-24 left-10 h-[520px] w-[520px] rounded-full bg-blue-500/15 blur-3xl" />
          <div className="absolute -bottom-32 right-10 h-[520px] w-[520px] rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative">
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">Contact</h1>
            <p className="text-muted-foreground max-w-2xl">
              Support, partenariats, presse. Réponse rapide en général sous 24h.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Support</div>
            <div className="text-muted-foreground">support@smartpark.com</div>
          </div>
          <div className="rounded-2xl glass p-6">
            <div className="font-display text-xl font-bold mb-2">Partenariats</div>
            <div className="text-muted-foreground">partners@smartpark.com</div>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/privacy" className="text-primary hover:underline">
            Voir la politique de confidentialité
          </Link>
        </div>
      </div>
    </main>
  );
}
