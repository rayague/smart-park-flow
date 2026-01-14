import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-transparent overflow-x-hidden">
      <Header />
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
            <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">Inscription</h1>
                <p className="text-muted-foreground max-w-xl">
                  Débloque l’expérience complète : réservation instantanée, suivi intelligent et paiements sans friction.
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
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nom complet"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>

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

                  <label className="flex items-start gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" className="mt-1 h-4 w-4" />
                    <span>
                      J’accepte les{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        conditions
                      </Link>{' '}
                      et la{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        confidentialité
                      </Link>
                      .
                    </span>
                  </label>

                  <Button type="submit" size="lg" className="w-full gradient-primary text-primary-foreground border-0">
                    Créer mon compte
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                      Se connecter
                    </Link>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
