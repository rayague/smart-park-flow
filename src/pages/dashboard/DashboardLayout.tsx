import { Outlet } from 'react-router-dom';

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background dark:bg-transparent">
      <DashboardSidebar />
      <div className="ml-64 transition-all duration-300">
        <DashboardHeader title="Dashboard" subtitle="Bienvenue" />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
