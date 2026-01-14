import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type MarketingPageLayoutProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function MarketingPageLayout({ title, subtitle, children }: MarketingPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-transparent overflow-x-hidden">
      <Header />
      <main className="pt-28">
        <section className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-12">
            <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
            <div className="relative">
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-3 gradient-text">{title}</h1>
              {subtitle && <p className="text-muted-foreground text-base md:text-lg max-w-2xl">{subtitle}</p>}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="glass rounded-3xl p-6 md:p-10">{children}</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default MarketingPageLayout;
