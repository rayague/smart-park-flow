'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2, Car, Clock, Eye, EyeOff, Globe, Hash, Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'user' | null>(null);
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [evDriver, setEvDriver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Valider que nous sommes à la dernière étape
      if (step < getTotalSteps()) {
        return;
      }

      setIsLoading(true);
      setError(null);

      // Préparer les données selon le rôle
      const userData: any = {
        role,
        name,
        email,
        password,
        confirmPassword,
      };

      // Ajouter les champs spécifiques au rôle
      if (role === 'client') {
        userData.vehiclePlate = vehiclePlate;
        userData.vehicleType = vehicleType;
        userData.evDriver = evDriver;
      } else if (role === 'user') {
        userData.businessName = businessName;
        userData.phone = phone;
        userData.country = country;
        userData.city = city;
      }

      // Appeler l'API d'inscription
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Gérer les erreurs de validation
        if (response.status === 400 && data.details) {
          // Erreurs de validation spécifiques
          setError(data.details.join(', '));
          return;
        }
        
        // Autres erreurs
        setError(data.error || 'Une erreur est survenue');
        return;
      }

      // Succès !
      console.log('Registration successful:', data);
      
      // Sauvegarder le token et les infos utilisateur
      if (typeof window !== 'undefined') {
        localStorage.setItem('smartpark_token', data.token);
        localStorage.setItem('smartpark_user', JSON.stringify(data.user));
      }

      setSuccess(true);
      // TODO: Rediriger vers le dashboard après un délai
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (error) {
      console.error('Network error:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Validation par étape
  const validateCurrentStep = () => {
    const errors: string[] = [];
    
    if (role === 'client') {
      if (step === 1) {
        if (!name || name.trim().length < 2) {
          errors.push('Le nom complet doit contenir au moins 2 caractères');
        }
      } else if (step === 2) {
        if (!vehiclePlate || vehiclePlate.trim().length < 2) {
          errors.push('La plaque d\'immatriculation est requise');
        }
        if (!vehicleType || vehicleType.trim().length < 2) {
          errors.push('Le type de véhicule est requis');
        }
      } else if (step === 3) {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.push('L\'email n\'est pas valide');
        }
        if (!password || password.length < 6) {
          errors.push('Le mot de passe doit contenir au moins 6 caractères');
        }
        if (password !== confirmPassword) {
          errors.push('Les mots de passe ne correspondent pas');
        }
      }
    } else if (role === 'user') {
      if (step === 1) {
        if (!businessName || businessName.trim().length < 2) {
          errors.push('Le nom de l\'entreprise est requis');
        }
      } else if (step === 2) {
        if (!name || name.trim().length < 2) {
          errors.push('Le nom complet doit contenir au moins 2 caractères');
        }
        if (!phone || phone.trim().length < 6) {
          errors.push('Le numéro de téléphone est requis');
        }
        if (!country || country.trim().length < 2) {
          errors.push('Le pays est requis');
        }
        if (!city || city.trim().length < 2) {
          errors.push('La ville est requise');
        }
      } else if (step === 3) {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.push('L\'email n\'est pas valide');
        }
        if (!password || password.length < 6) {
          errors.push('Le mot de passe doit contenir au moins 6 caractères');
        }
        if (password !== confirmPassword) {
          errors.push('Les mots de passe ne correspondent pas');
        }
      }
    }
    
    setStepErrors(errors);
    return errors.length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
      setStepErrors([]);
    }
  };
  const prevStep = () => {
    setStep(step - 1);
    setStepErrors([]);
  };

  const getTotalSteps = () => {
    if (role === 'client') return 3;
    if (role === 'user') return 3;
    return 0;
  };

  const getStepTitle = () => {
    if (role === 'client') {
      if (step === 1) return t.auth.fullName;
      if (step === 2) return t.auth.vehicleInfo;
      if (step === 3) return t.auth.accountSecurity;
    }
    if (role === 'user') {
      if (step === 1) return t.auth.businessInfo;
      if (step === 2) return t.auth.contactInfo;
      if (step === 3) return t.auth.accountSecurity;
    }
    return '';
  };

  // Vérifier si l'étape actuelle est valide
  const isCurrentStepValid = () => {
    if (role === 'client') {
      if (step === 1) {
        return name && name.trim().length >= 2;
      } else if (step === 2) {
        return vehiclePlate && vehiclePlate.trim().length >= 2 && 
               vehicleType && vehicleType.trim().length >= 2;
      } else if (step === 3) {
        return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
               password && password.length >= 6 &&
               password === confirmPassword;
      }
    } else if (role === 'user') {
      if (step === 1) {
        return businessName && businessName.trim().length >= 2;
      } else if (step === 2) {
        return name && name.trim().length >= 2 &&
               phone && phone.trim().length >= 6 &&
               country && country.trim().length >= 2 &&
               city && city.trim().length >= 2;
      } else if (step === 3) {
        return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
               password && password.length >= 6 &&
               password === confirmPassword;
      }
    }
    return false;
  };

  return (
    <main className="pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-6 md:p-10">
          <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text mb-3">{t.auth.createAccount}</h1>
              <p className="text-muted-foreground max-w-xl">{t.auth.createAccountDesc}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl glass p-6 md:p-8"
            >
              {role === null ? (
                <div className="space-y-5">
                  <div className="text-center">
                    <h2 className="font-display text-xl font-bold">{t.auth.chooseRoleTitle}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{t.auth.chooseRoleDesc}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRole('client');
                        setStep(1);
                      }}
                      className="text-left rounded-2xl glass p-4 border border-border hover:border-primary/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-semibold">{t.auth.roleClient}</div>
                          <div className="text-sm text-muted-foreground">{t.auth.fullName}</div>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRole('user');
                        setStep(1);
                      }}
                      className="text-left rounded-2xl glass p-4 border border-border hover:border-primary/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-semibold">{t.auth.roleOwner}</div>
                          <div className="text-sm text-muted-foreground">{t.auth.businessName}</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    {t.auth.hasAccount}{' '}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                      {t.auth.signInLink}
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {t.auth.chooseRoleTitle}: <span className="text-foreground font-medium">{role === 'client' ? t.auth.roleClient : t.auth.roleOwner}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => {
                        setRole(null);
                        setStep(1);
                      }}
                    >
                      {t.auth.changeRole}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    {Array.from({ length: getTotalSteps() }, (_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-colors ${
                          i + 1 === step ? 'bg-primary' : i + 1 < step ? 'bg-primary/50' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <h3 className="font-display text-lg font-semibold">{getStepTitle()}</h3>
                  </div>

                  {stepErrors.length > 0 && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                      <p className="text-sm text-red-600 font-medium mb-1">Veuillez corriger les erreurs suivantes :</p>
                      <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                        {stepErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                      <p className="text-sm text-green-600">
                        Inscription réussie ! Redirection vers votre tableau de bord...
                      </p>
                    </div>
                  )}

                  {role === 'client' && step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="client-name" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.fullName}
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="client-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t.auth.fullNamePlaceholder}
                            required
                            minLength={2}
                            maxLength={100}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {role === 'client' && step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="client-vehicle-plate" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.vehiclePlate}
                        </label>
                        <div className="relative">
                          <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="client-vehicle-plate"
                            type="text"
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                            placeholder={t.auth.vehiclePlatePlaceholder}
                            required
                            minLength={2}
                            maxLength={20}
                            pattern="[A-Z0-9\-\s]+"
                            title="Format: Lettres, chiffres, tirets et espaces uniquement"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="client-vehicle-type" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.vehicleType}
                        </label>
                        <div className="relative">
                          <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="client-vehicle-type"
                            type="text"
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                            placeholder={t.auth.vehicleTypePlaceholder}
                            required
                            minLength={2}
                            maxLength={50}
                            pattern="[A-Za-z\s\-]+"
                            title="Format: Lettres, espaces et tirets uniquement"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          id="client-ev-driver"
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          checked={evDriver}
                          onChange={(e) => setEvDriver(e.target.checked)}
                        />
                        <label htmlFor="client-ev-driver" className="text-sm text-muted-foreground cursor-pointer">
                          {t.auth.evDriver}
                        </label>
                      </div>
                    </div>
                  )}

                  {role === 'user' && step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="user-business-name" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.businessName}
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="user-business-name"
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder={t.auth.businessNamePlaceholder}
                            required
                            minLength={2}
                            maxLength={100}
                            pattern="[A-Za-z0-9\s\-&]+"
                            title="Format: Lettres, chiffres, espaces, tirets et & uniquement"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {role === 'user' && step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="user-name" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.fullName}
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="user-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t.auth.fullNamePlaceholder}
                            required
                            minLength={2}
                            maxLength={100}
                            pattern="[A-Za-z\s\-']+"
                            title="Format: Lettres, espaces, tirets et apostrophes uniquement"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="user-phone" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.phone}
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="user-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t.auth.phonePlaceholder}
                            required
                            minLength={6}
                            maxLength={20}
                            pattern="[+]?[0-9\s\-\(\)]+"
                            title="Format: Numéro de téléphone valide (ex: +33 6 12 34 56 78)"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="user-country" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.country}
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="user-country"
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder={t.auth.countryPlaceholder}
                            required
                            minLength={2}
                            maxLength={50}
                            pattern="[A-Za-z\s\-']+"
                            title="Format: Nom de pays valide"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="user-city" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.city}
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="user-city"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder={t.auth.cityPlaceholder}
                            required
                            minLength={2}
                            maxLength={50}
                            pattern="[A-Za-z\s\-']+"
                            title="Format: Nom de ville valide"
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(role === 'client' && step === 3) || (role === 'user' && step === 3) ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="user-email" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.email}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="user-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.auth.emailPlaceholder}
                            required
                            maxLength={255}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="user-password" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.password}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="user-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t.auth.passwordPlaceholder}
                            required
                            minLength={6}
                            maxLength={128}
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}"
                            title="Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule et un chiffre"
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
                      </div>

                      <div>
                        <label htmlFor="user-confirm-password" className="block text-sm font-medium text-foreground mb-2">
                          {t.auth.confirmPassword}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <input
                            id="user-confirm-password"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t.auth.confirmPasswordPlaceholder}
                            required
                            minLength={6}
                            maxLength={128}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <input
                          id="user-terms"
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                          required
                        />
                        <label htmlFor="user-terms" className="text-sm text-muted-foreground cursor-pointer">
                          {t.auth.acceptTermsPrefix}{' '}
                          <Link href="/#terms" className="text-primary hover:underline">
                            {t.auth.terms}
                          </Link>{' '}
                          {t.auth.acceptTermsMiddle}{' '}
                          <Link href="/#privacy" className="text-primary hover:underline">
                            {t.auth.privacy}
                          </Link>
                          .
                        </label>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex gap-3">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1"
                      >
                        Précédent
                      </Button>
                    )}
                    {step < getTotalSteps() ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={isLoading || !isCurrentStepValid()}
                        className="flex-1 gradient-primary text-primary-foreground border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Chargement...
                          </span>
                        ) : (
                          <>
                            Suivant
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={isLoading || !isCurrentStepValid()}
                        className="flex-1 gradient-primary text-primary-foreground border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Inscription...
                          </span>
                        ) : (
                          <>
                            {t.auth.signUp}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    {t.auth.hasAccount}{' '}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                      {t.auth.signInLink}
                    </Link>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
