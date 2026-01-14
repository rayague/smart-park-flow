import { MarketingPageLayout } from './MarketingPageLayout';

export default function Features() {
  return (
    <MarketingPageLayout
      title="Fonctionnalités"
      subtitle="Tout ce qu’il faut pour une expérience parking fluide, rapide et premium."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl glass p-6">
          <div className="font-display text-xl font-bold mb-2">Réservation instantanée</div>
          <div className="text-muted-foreground">Réserve une place en quelques secondes.</div>
        </div>
        <div className="rounded-2xl glass p-6">
          <div className="font-display text-xl font-bold mb-2">Bornes EV</div>
          <div className="text-muted-foreground">Trouve et paie la recharge sans friction.</div>
        </div>
        <div className="rounded-2xl glass p-6">
          <div className="font-display text-xl font-bold mb-2">Guidage intelligent</div>
          <div className="text-muted-foreground">Optimise ton trajet et évite les détours.</div>
        </div>
        <div className="rounded-2xl glass p-6">
          <div className="font-display text-xl font-bold mb-2">Paiements</div>
          <div className="text-muted-foreground">Rapide, sécurisé, et transparent.</div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
