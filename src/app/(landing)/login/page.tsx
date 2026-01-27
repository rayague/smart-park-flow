'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { fetchJson } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'client' | 'admin';
  };
};

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const data = await fetchJson<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      window.localStorage.setItem('smartpark-token', data.token);
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });

      const targetBase =
        data.user.role === 'admin'
          ? '/admin/dashboard'
          : data.user.role === 'client'
            ? '/client/dashboard'
            : '/user/dashboard';

      router.push(targetBase);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
          <div className="absolute -top-28 -right-28 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">Connexion</h1>
              <p className="text-muted-foreground max-w-xl">
                Reprends exactement là où tu t’es arrêté — réservations, paiements, et expérience premium.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl glass p-6 md:p-8"
            >
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Afficher/masquer le mot de passe"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" className="h-4 w-4" />
                    Se souvenir de moi
                  </label>
                  <button type="button" className="text-sm text-primary hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gradient-primary text-primary-foreground border-0"
                  disabled={isSubmitting}
                >
                  Se connecter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {error && <div className="text-sm text-muted-foreground">{error}</div>}

                <div className="text-center text-sm text-muted-foreground">
                  Pas de compte ?{' '}
                  <Link href="/register" className="text-primary font-medium hover:underline">
                    Créer un compte
                  </Link>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
