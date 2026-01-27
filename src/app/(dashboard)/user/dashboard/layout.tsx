import DashboardSidebar from '../../dashboard/_components/DashboardSidebar';
import DashboardTopbar from '../../dashboard/_components/DashboardTopbar';
import RoleGate from '@/components/auth/RoleGate';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate requiredRole="user">
      <div className="min-h-dvh bg-background dark:bg-transparent">
        <DashboardSidebar basePath="/user/dashboard" />
        <div className="ml-64">
          <DashboardTopbar title="User Dashboard" subtitle="Bienvenue" />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </RoleGate>
  );
}
