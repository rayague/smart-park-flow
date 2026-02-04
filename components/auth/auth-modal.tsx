"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User, Eye, EyeOff, Car, Github, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUIStore, useAuthStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function AuthModal() {
  const { isAuthModalOpen, authModalView, closeAuthModal, openAuthModal } = useUIStore()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    name: "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    // Simple validation
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (authModalView === "register" && !formData.name) {
      newErrors.name = "Name is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const { apiRequest } = await import("@/lib/api")

      const endpoint = authModalView === "login" ? "/auth/login" : "/auth/register"
      const data = await apiRequest<{ user: any, token: string }>(endpoint, {
        method: "POST",
        body: JSON.stringify(formData)
      })

      login(data.user, data.token)
      closeAuthModal()

      // Redirect based on role
      const role = data.user.role
      if (role === 'admin') window.location.href = "/dashboard/admin"
      else if (role === 'manager') window.location.href = "/dashboard/proprietaire"
      else window.location.href = "/dashboard/client"

    } catch (error: any) {
      setErrors({ server: error.message || "Authentication failed" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: "user" | "manager" | "admin") => {
    setIsLoading(true)
    const emails = {
      user: "user@example.com",
      manager: "manager@example.com",
      admin: "admin@example.com"
    }

    try {
      const { apiRequest } = await import("@/lib/api")
      const data = await apiRequest<{ user: any, token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: emails[role], password: "password123" })
      })

      login(data.user, data.token)
      closeAuthModal()

      if (role === 'admin') window.location.href = "/dashboard/admin"
      else if (role === 'manager') window.location.href = "/dashboard/proprietaire"
      else window.location.href = "/dashboard/client"
    } catch (error) {
      console.error("Demo login failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthModalOpen) return null

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl glass-strong">
              {/* Background Pattern */}
              <div className="absolute inset-0 grid-pattern opacity-20" />

              {/* Close Button */}
              <button
                onClick={closeAuthModal}
                className="absolute right-4 top-4 z-10 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary glow-primary"
                  >
                    <Car className="h-7 w-7 text-primary-foreground" />
                  </motion.div>
                  <h2 className="font-serif text-2xl font-bold">
                    {authModalView === "login" ? "Welcome back" : "Create account"}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {authModalView === "login"
                      ? "Sign in to your SmartPark account"
                      : "Start your smart parking journey"}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {authModalView === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className={cn(
                            "pl-10",
                            errors.name && "border-destructive"
                          )}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={cn(
                          "pl-10",
                          errors.email && "border-destructive"
                        )}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className={cn(
                          "pl-10 pr-10",
                          errors.password && "border-destructive"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    )}
                  </div>

                  {authModalView === "login" && (
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary glow-primary-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
                      />
                    ) : authModalView === "login" ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Chrome className="h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Button>
                </div>

                {/* Demo Accounts */}
                <div className="mt-6 rounded-lg bg-secondary/50 p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Quick Demo Access:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDemoLogin("user")}
                      className="text-xs"
                    >
                      User
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDemoLogin("manager")}
                      className="text-xs"
                    >
                      Manager
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDemoLogin("admin")}
                      className="text-xs"
                    >
                      Admin
                    </Button>
                  </div>
                </div>

                {/* Switch Auth Mode */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  {authModalView === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => openAuthModal("register")}
                        className="font-medium text-primary hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => openAuthModal("login")}
                        className="font-medium text-primary hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
