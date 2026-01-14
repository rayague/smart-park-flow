import { MarketingPageLayout } from './MarketingPageLayout';

export default function About() {
  return (
    <MarketingPageLayout
      title="À propos"
      subtitle="SmartPark transforme la recherche de parking en une expérience instantanée et élégante."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl glass p-6">
          <div className="font-display font-bold mb-2">Vision</div>
          <div className="text-muted-foreground">Moins de stress, plus de temps, plus d’impact.</div>
        </div>
        <div className="rounded-2xl glass p-6">
          <div className="font-display font-bold mb-2">Technologie</div>
          <div className="text-muted-foreground">Temps réel, design system, et performance.</div>
        </div>
        <div className="rounded-2xl glass p-6">
          <div className="font-display font-bold mb-2">Confiance</div>
          <div className="text-muted-foreground">Transparence et sécurité par défaut.</div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
