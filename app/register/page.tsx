"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft,
    ArrowRight,
    User,
    Building2,
    Mail,
    Lock,
    Shield,
    Car,
    Phone,
    Globe,
    Briefcase,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/store"
import { AuthLoadingOverlay } from "@/components/auth/auth-loading-overlay"

type Role = "client" | "proprietaire" | "admin" | null

export default function RegisterPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { login, setLoading, isLoading } = useAuthStore()
    const [step, setStep] = React.useState(0)
    const [role, setRole] = React.useState<Role>(null)
    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        vehiclePlate: "", // Client specific
        companyName: "", // Proprietor specific
        address: "",
        agree: false
    })

    const isStepValid = () => {
        switch (step) {
            case 0: return role !== null
            case 1: return formData.firstName.trim() !== "" && formData.lastName.trim() !== "" && formData.email.trim() !== ""
            case 2:
                if (role === "client") return formData.vehiclePlate.trim() !== ""
                if (role === "proprietaire") return formData.companyName.trim() !== ""
                return true
            case 3: return formData.password.trim().length >= 8 && formData.agree === true
            default: return false
        }
    }

    const handleNext = () => {
        if (isStepValid()) {
            if (step === 3) {
                // Final submission simulation
                handleSubmit()
            } else {
                setStep(prev => prev + 1)
            }
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const { signUp, upsertProfile } = await import("@/lib/auth")

            const fullName = `${formData.firstName} ${formData.lastName}`.trim()
            const dbRole = role === "admin" ? "ADMIN" : role === "proprietaire" ? "MANAGER" : "USER"

            const { user, session } = await signUp(formData.email, formData.password, {
                name: fullName,
                role: dbRole as any,
            })

            if (!user) {
                throw new Error("Signup failed")
            }

            const profile = await upsertProfile({
                id: user.id,
                email: user.email || formData.email,
                name: fullName,
                phone: formData.phone || null,
                role: dbRole as any,
            })

            setStep(4) // Success step

            setTimeout(() => {
                if (session?.access_token) {
                    login(
                        {
                            id: user.id,
                            email: user.email!,
                            name: profile.name,
                            role: profile.role.toLowerCase() as 'user' | 'manager' | 'admin',
                            avatar: profile.avatar_url ?? undefined,
                            createdAt: new Date(profile.created_at),
                        },
                        session.access_token
                    )

                    if (profile.role === "ADMIN") router.push("/dashboard/admin")
                    else if (profile.role === "MANAGER") router.push("/dashboard/manager")
                    else router.push("/dashboard/client")
                } else {
                    router.push("/login")
                }
            }, 1200)
        } catch (e) {
            router.push("/login")
        } finally {
            setLoading(false)
        }
    }

    const progressValue = (step / 3) * 100

    return (
        <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
            <AuthLoadingOverlay isLoading={isLoading} message={t.common.loading} />
            {/* Background pattern */}
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 p-8 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-accent transition-transform group-hover:scale-110">
                        <Car className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-sans text-xl font-bold">SmartPark</span>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:inline">{t.auth.register.hasAccount}</span>
                    <Button variant="ghost" className="font-bold" asChild>
                        <Link href="/login">{t.auth.register.signInLink}</Link>
                    </Button>
                </div>
            </header>

            {/* Form Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        {step === 0 ? (
                            <motion.div
                                key="step-0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black font-sans">{t.auth.register.title}</h1>
                                    <p className="text-muted-foreground">{t.auth.register.subtitle}</p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6">
                                    <button
                                        onClick={() => setRole("client")}
                                        className={cn(
                                            "flex flex-col items-center gap-6 p-8 rounded-3xl glass border-2 transition-all group",
                                            role === "client" ? "border-primary bg-primary/5 glow-primary-sm" : "border-white/5 hover:border-primary/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-20 w-20 rounded-2xl flex items-center justify-center transition-all",
                                            role === "client" ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary/20"
                                        )}>
                                            <User className="h-10 w-10" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xl font-black uppercase tracking-wider">{t.auth.register.roles.user}</p>
                                            <p className="text-sm text-muted-foreground">{t.landing.features.instant || "Find and book parking spots instantly."}</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setRole("proprietaire")}
                                        className={cn(
                                            "flex flex-col items-center gap-6 p-8 rounded-3xl glass border-2 transition-all group",
                                            role === "proprietaire" ? "border-accent bg-accent/5 shadow-accent/20 shadow-lg" : "border-white/5 hover:border-accent/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-20 w-20 rounded-2xl flex items-center justify-center transition-all",
                                            role === "proprietaire" ? "bg-accent text-white" : "bg-accent/10 text-accent group-hover:bg-accent/20"
                                        )}>
                                            <Building2 className="h-10 w-10" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xl font-black uppercase tracking-wider">{t.auth.register.roles.manager}</p>
                                            <p className="text-sm text-muted-foreground">{t.landing.footer.description || "Manage your facilities and grow revenue."}</p>
                                        </div>
                                    </button>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={handleNext}
                                    disabled={!role}
                                    className="h-14 px-12 rounded-2xl text-lg font-bold bg-linear-to-r from-primary to-accent"
                                >
                                    {t.common.next} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </motion.div>
                        ) : step === 4 ? (
                            <motion.div
                                key="step-success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 glass p-12 rounded-3xl"
                            >
                                <div className="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="h-12 w-12" />
                                </div>
                                <h1 className="text-3xl font-black font-sans">{t.auth.register.successTitle || "Welcome to SmartPark!"}</h1>
                                <p className="text-muted-foreground max-w-xs mx-auto">{t.auth.register.successSubtitle || "Your account has been created successfully. Redirecting you to your dashboard..."}</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`step-${step}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass p-8 sm:p-12 rounded-[2.5rem] border-white/10 space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} className="gap-2">
                                            <ArrowLeft className="h-4 w-4" /> {t.common.back}
                                        </Button>
                                        <span className="text-xs font-black uppercase tracking-widest text-primary">{t.common.step || "Step"} {step} {t.common.of || "of"} 3</span>
                                    </div>
                                    <Progress value={progressValue} className="h-1.5" />
                                </div>

                                <div className="space-y-6">
                                    {step === 1 && (
                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-black font-sans">{t.auth.register.personalDetails || "Personal Details"}</h2>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold uppercase tracking-tight ml-1">{t.auth.register.firstName || "First Name"}</label>
                                                    <Input
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        placeholder="John"
                                                        className="h-14 rounded-2xl bg-background border-border/50 focus:border-primary"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold uppercase tracking-tight ml-1">{t.auth.register.lastName || "Last Name"}</label>
                                                    <Input
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                        placeholder="Doe"
                                                        className="h-14 rounded-2xl bg-background border-border/50 focus:border-primary"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-tight ml-1">{t.auth.register.email}</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        className="h-14 rounded-2xl bg-background border-border/50 focus:border-primary pl-12"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-black font-sans">
                                                {role === "client" ? (t.auth.register.vehicleInfo || "Vehicle Info") : (t.auth.register.professionalInfo || "Professional Info")}
                                            </h2>
                                            {role === "client" ? (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold uppercase tracking-tight ml-1">{t.auth.register.licensePlate || "License Plate"}</label>
                                                    <div className="relative">
                                                        <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                        <Input
                                                            value={formData.vehiclePlate}
                                                            onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                                                            placeholder="AA-123-BB"
                                                            className="h-14 rounded-2xl bg-background border-border/50 focus:border-primary pl-12"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold uppercase tracking-tight ml-1">{t.auth.register.companyName || "Company Name"}</label>
                                                        <div className="relative">
                                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                            <Input
                                                                value={formData.companyName}
                                                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                                placeholder="Smart Park Solutions S.A."
                                                                className="h-14 rounded-2xl bg-background border-border/50 focus:border-primary pl-12"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold uppercase tracking-tight ml-1">{t.auth.register.phone || "Contact Phone"}</label>
                                                        <div className="relative">
                                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                            <Input
                                                                value={formData.phone}
                                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                                placeholder="+33 6 12 34 56 78"
                                                                className="h-14 rounded-2xl bg-background border-border/50 focus:border-primary pl-12"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-black font-sans">{t.auth.register.security || "Security"}</h2>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-tight ml-1">{t.auth.register.choosePassword || "Choose Password"}</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="h-14 rounded-2xl bg-background border-border/50 focus:border-primary pl-12"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-muted-foreground ml-1">{t.auth.register.passwordMinLength || "Minimum 8 characters with at least one number."}</p>
                                            </div>
                                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                                <Checkbox
                                                    id="agree"
                                                    checked={formData.agree}
                                                    onCheckedChange={(checked) => setFormData({ ...formData, agree: !!checked })}
                                                    className="mt-1"
                                                />
                                                <div className="space-y-1">
                                                    <label htmlFor="agree" className="text-sm font-bold select-none cursor-pointer">
                                                        {t.auth.register.termsTitle || "Terms & Privacy Policy"}
                                                    </label>
                                                    <p className="text-xs text-muted-foreground">{t.auth.register.terms || "I acknowledge that I have read and agree to the general terms of service."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <Button
                                        onClick={handleNext}
                                        disabled={!isStepValid() || isLoading}
                                        className="w-full h-16 rounded-2xl text-lg font-bold bg-linear-to-r from-primary to-accent transition-all animate-in fade-in"
                                    >
                                        {isLoading ? t.common.loading : step === 3 ? (t.auth.register.button || "Create Account") : (t.common.next || "Next Step")}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                    {!isStepValid() && (
                                        <p className="text-[10px] text-center text-destructive mt-3 uppercase font-bold tracking-widest">
                                            {t.auth.register.requiredFields || "All fields in this step are required"}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Support footer */}
            <footer className="relative z-10 p-8 text-center">
                <p className="text-xs text-muted-foreground">© 2026 SmartPark Global. {t.auth.register.encrypted || "Protected by AES-256 encryption."}</p>
            </footer>
        </div>
    )
}
