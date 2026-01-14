'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { DarkModeBackground } from '@/components/threejs/DarkModeBackground';
import { InitialLoader } from '@/components/threejs/InitialLoader';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useAppStore } from '@/store/useAppStore';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((state) => state.theme);
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {mounted && (
          <>
            <InitialLoader />
            <DarkModeBackground />
          </>
        )}
        <div className="relative z-10">{children}</div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
