import { MarketingPageLayout } from './MarketingPageLayout';

export default function Discover() {
  return (
    <MarketingPageLayout
      title="Découvrir"
      subtitle="Explore des parkings intelligents, compare, réserve, et recharge en toute simplicité."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl glass p-6">
          <div className="font-display text-xl font-bold mb-2">Recherche</div>
          <div className="text-muted-foreground">
            Filtre par ville, prix, disponibilité, et bornes de recharge.
          </div>
        </div>
        <div className="rounded-2xl glass p-6">
          <div className="font-display text-xl font-bold mb-2">Carte</div>
          <div className="text-muted-foreground">
            Visualise en temps réel les places libres autour de toi.
          </div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
