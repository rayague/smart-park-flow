import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, CircleDollarSign, Compass, Info, LogIn, Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { href: '/', label: t.nav.home, icon: Car },
    { href: '/discover', label: t.nav.discover, icon: Compass },
    { href: '/pricing', label: t.nav.pricing, icon: CircleDollarSign },
    { href: '/about', label: t.nav.about, icon: Info },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <nav className="glass-strong rounded-2xl px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center"
              >
                <Car className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span className="font-display text-xl font-bold gradient-text">
                SmartPark
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative text-muted-foreground hover:text-foreground transition-colors font-medium group"
                >
                  <span className="inline-flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-primary rounded-full transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <Button asChild variant="ghost" className="font-medium">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  {t.nav.signIn}
                </Link>
              </Button>
              <Button asChild className="gradient-primary font-medium text-primary-foreground border-0">
                <Link to="/register">
                  <Sparkles className="h-4 w-4" />
                  {t.nav.getStarted}
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden h-10 w-10 rounded-xl glass flex items-center justify-center"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden md:hidden"
          >
            <div className="pt-4 pb-2 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="pt-4 flex items-center gap-3">
                <LanguageToggle />
                <ThemeToggle />
                <Button asChild variant="ghost" className="flex-1">
                  <Link to="/login">{t.nav.signIn}</Link>
                </Button>
                <Button asChild className="flex-1 gradient-primary text-primary-foreground border-0">
                  <Link to="/register">{t.nav.getStarted}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
}

export default Header;
