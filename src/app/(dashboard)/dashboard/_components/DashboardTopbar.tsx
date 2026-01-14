'use client';

import { Bell, Search, User } from 'lucide-react';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/button';

export default function DashboardTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="h-16 px-6 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-30">
      <div>
        <h1 className="font-display text-xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <ThemeToggle />

        <button className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
          <User className="h-5 w-5 text-primary-foreground" />
        </button>
      </div>
    </header>
  );
}
