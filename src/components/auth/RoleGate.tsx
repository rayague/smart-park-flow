'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { fetchJson } from '@/lib/api';
import { useAppStore, type UserRole } from '@/store/useAppStore';

type MeResponse = {
  user: null | {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
};

function roleToBase(role: UserRole) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'client') return '/client/dashboard';
  return '/user/dashboard';
}

export default function RoleGate({
  requiredRole,
  children,
}: {
  requiredRole: UserRole;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAppStore((s) => s.setUser);
  const logout = useAppStore((s) => s.logout);

  const token = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('smartpark-token');
  }, []);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!token) {
        logout();
        if (!cancelled) {
          router.replace('/login');
        }
        return;
      }

      try {
        const me = await fetchJson<MeResponse>('/api/users/me');

        if (!me.user) {
          window.localStorage.removeItem('smartpark-token');
          logout();
          if (!cancelled) {
            router.replace('/login');
          }
          return;
        }

        setUser(me.user);

        if (me.user.role !== requiredRole) {
          const target = roleToBase(me.user.role);
          if (!cancelled && pathname !== target) {
            router.replace(target);
          }
          return;
        }

        if (!cancelled) setIsReady(true);
      } catch {
        window.localStorage.removeItem('smartpark-token');
        logout();
        if (!cancelled) {
          router.replace('/login');
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [logout, pathname, requiredRole, router, setUser, token]);

  if (!isReady) return null;

  return <>{children}</>;
}
