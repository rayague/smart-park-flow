"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Car, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslation } from "@/lib/i18n"
import { useAuthStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { AuthLoadingOverlay } from "@/components/auth/auth-loading-overlay"

export default function LoginPage() {
    const { t } = useTranslation()
    const { login, setLoading, isLoading } = useAuthStore()
    const { toast } = useToast()
    const router = useRouter()

    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Use Supabase Auth instead of custom API
            const { signIn, getProfile } = await import('@/lib/auth')
            const { user, session } = await signIn(email, password)

            if (!user) {
                throw new Error('Login failed')
            }

            // Get user profile to get role
            const profile = await getProfile(user.id)

            // Store in auth store (convert role to lowercase)
            login({
                id: user.id,
                email: user.email!,
                name: profile.name,
                role: profile.role.toLowerCase() as 'user' | 'manager' | 'admin',
                createdAt: new Date(profile.created_at),
            }, session.access_token)

            toast({
                title: t.common.success,
                description: t.auth.login.success || "Login successful!"
            })

            // Redirect based on role — immediately, no setTimeout
            if (profile.role === 'ADMIN') router.push("/dashboard/admin")
            else if (profile.role === 'MANAGER') router.push("/dashboard/manager")
            else router.push("/dashboard/client")

        } catch (error: any) {
            // Ignore AbortError — caused by navigation interrupting in-flight Supabase requests
            if (error?.name === 'AbortError') return
            toast({
                title: t.common.error,
                description: error.message || t.auth.login.error || "Login failed. Please check your credentials.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
            <AuthLoadingOverlay isLoading={isLoading} message={t.common.loading} />
            {/* Left Panel - Form */}
            <div className="relative z-10 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12">
                <Link href="/" className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    {t.common.back}
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md mx-auto space-y-8"
                >
                    <div className="space-y-2">
                        <h1 className="font-sans text-3xl font-bold">{t.auth.login.title}</h1>
                        <p className="text-muted-foreground">{t.auth.login.subtitle}</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.auth.login.email}</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="hello@example.com"
                                    className="pl-10 h-12 bg-background border-border/50 focus:border-primary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.auth.login.password}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 h-12 bg-background border-border/50 focus:border-primary"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <Checkbox id="remember" />
                                <label htmlFor="remember" className="font-medium cursor-pointer">{t.auth.login.rememberMe}</label>
                            </div>
                            <Link href="#" className="text-primary hover:underline font-medium">
                                {t.auth.login.forgotPassword}
                            </Link>
                        </div>

                        <Button
                            className="w-full h-12 text-base font-medium glow-primary bg-linear-to-r from-primary to-accent"
                            disabled={isLoading}
                            type="submit"
                        >
                            {isLoading ? t.common.loading : t.auth.login.button}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground pt-4">
                        {t.auth.login.noAccount}{" "}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            {t.auth.login.signUpLink}
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* Right Panel - Visual */}
            <div className="hidden lg:block relative bg-muted/20 backdrop-blur-3xl overflow-hidden">
                <div className="absolute inset-0 glass-strong" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-20 text-center">
                    <FloatingCard
                        icon={Car}
                        title="Smart Parking"
                        desc="Find the perfect spot in seconds"
                        className="mb-8 rotate-3"
                    />
                    <h2 className="font-sans text-4xl font-bold mb-4 relative z-10">
                        {t.auth.login.visualTitle || "Simplifying Urban Mobility"}
                    </h2>
                    <p className="text-lg text-muted-foreground relative z-10 max-w-sm">
                        {t.auth.login.visualSubtitle || "Join thousands of drivers saving time and reducing emissions every day."}
                    </p>
                </div>
            </div>
        </div>
    )
}

function FloatingCard({ icon: Icon, title, desc, className }: any) {
    return (
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`bg-background/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 ${className}`}
        >
            <div className="h-12 w-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm">{desc}</p>
        </motion.div>
    )
}
