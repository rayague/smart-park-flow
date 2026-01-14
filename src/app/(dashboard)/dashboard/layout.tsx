import DashboardSidebar from './_components/DashboardSidebar';
import DashboardTopbar from './_components/DashboardTopbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background dark:bg-transparent">
      <DashboardSidebar />
      <div className="ml-64">
        <DashboardTopbar title="Dashboard" subtitle="Bienvenue" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
