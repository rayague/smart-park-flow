import { MarketingPageLayout } from './MarketingPageLayout';

export default function MobileApp() {
  return (
    <MarketingPageLayout
      title="Application Mobile"
      subtitle="Emporte SmartPark partout : réserver, payer, recharger, suivre."
    >
      <div className="text-muted-foreground">
        Page en préparation. Prochaine étape : QR check-in, wallet, et notifications push.
      </div>
    </MarketingPageLayout>
  );
}
