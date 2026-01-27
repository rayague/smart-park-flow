'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Map,
  Settings,
  Zap,
} from 'lucide-react';

import { cn } from '@/lib/utils';

type DashboardSidebarProps = {
  basePath?: string;
};

const items = [
  { path: '', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/discover', label: 'Find Parking', icon: Map },
  { path: '/reservations', label: 'Reservations', icon: Calendar },
  { path: '/charging', label: 'EV Charging', icon: Zap },
  { path: '/payments', label: 'Payments', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/help', label: 'Help', icon: HelpCircle },
];

export default function DashboardSidebar({ basePath = '/dashboard' }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-dvh w-64 z-40 flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="font-display text-lg font-bold">SmartPark</div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {items.map((item) => {
          const href = `${basePath}${item.path}`;
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
