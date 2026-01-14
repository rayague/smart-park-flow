import { MarketingPageLayout } from './MarketingPageLayout';

export default function Blog() {
  return (
    <MarketingPageLayout
      title="Blog"
      subtitle="Nouveautés, mobilité, optimisation urbaine et design produit."
    >
      <div className="text-muted-foreground">Articles à venir.</div>
    </MarketingPageLayout>
  );
}
