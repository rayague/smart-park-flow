import { MarketingPageLayout } from './MarketingPageLayout';

export default function Pricing() {
  return (
    <MarketingPageLayout
      title="Tarifs"
      subtitle="Une expérience premium, des prix transparents, et des options adaptées à tes besoins."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl glass p-6">
          <div className="font-display text-xl font-bold mb-1">Starter</div>
          <div className="text-muted-foreground mb-4">Pour tester la magie.</div>
          <div className="text-3xl font-bold mb-4">0€</div>
          <div className="text-muted-foreground">Accès limité + notifications.</div>
        </div>
        <div className="rounded-2xl glass-strong p-6 border border-primary/30">
          <div className="font-display text-xl font-bold mb-1">Pro</div>
          <div className="text-muted-foreground mb-4">Le meilleur rapport waow/prix.</div>
          <div className="text-3xl font-bold mb-4">9€</div>
          <div className="text-muted-foreground">Réservation + suivi + support.</div>
        </div>
        <div className="rounded-2xl glass p-6">
          <div className="font-display text-xl font-bold mb-1">Business</div>
          <div className="text-muted-foreground mb-4">Pour les gestionnaires.</div>
          <div className="text-3xl font-bold mb-4">29€</div>
          <div className="text-muted-foreground">Gestion multi-sites + analytics.</div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
