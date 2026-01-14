import { MarketingPageLayout } from './MarketingPageLayout';

export default function Help() {
  return (
    <MarketingPageLayout
      title="Centre d'aide"
      subtitle="Trouve rapidement des réponses et des guides."
    >
      <div className="grid gap-4">
        <div className="rounded-2xl glass p-6">
          <div className="font-semibold mb-1">Réservations</div>
          <div className="text-muted-foreground">Modifier, annuler, prolonger.</div>
        </div>
        <div className="rounded-2xl glass p-6">
          <div className="font-semibold mb-1">Paiements</div>
          <div className="text-muted-foreground">Factures, remboursements, moyens de paiement.</div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
