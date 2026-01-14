import AppFooter from '@/components/layout/AppFooter';
import AppNavbar from '@/components/layout/AppNavbar';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background dark:bg-transparent text-foreground">
      <AppNavbar />
      {children}
      <AppFooter />
    </div>
  );
}
