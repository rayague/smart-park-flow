import { MarketingPageLayout } from './MarketingPageLayout';

export default function Contact() {
  return (
    <MarketingPageLayout
      title="Contact"
      subtitle="Une question ? Un partenariat ? Écris-nous."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl glass p-6">
          <div className="font-display text-xl font-bold mb-2">Support</div>
          <div className="text-muted-foreground">support@smartpark.app</div>
        </div>
        <div className="rounded-2xl glass p-6">
          <div className="font-display text-xl font-bold mb-2">Partenariats</div>
          <div className="text-muted-foreground">partners@smartpark.app</div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
