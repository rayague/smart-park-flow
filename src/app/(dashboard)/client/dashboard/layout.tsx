import DashboardSidebar from '../../dashboard/_components/DashboardSidebar';
import DashboardTopbar from '../../dashboard/_components/DashboardTopbar';
import RoleGate from '@/components/auth/RoleGate';

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate requiredRole="client">
      <div className="min-h-dvh bg-background dark:bg-transparent">
        <DashboardSidebar basePath="/client/dashboard" />
        <div className="ml-64">
          <DashboardTopbar title="Client Dashboard" subtitle="Bienvenue" />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </RoleGate>
  );
}
