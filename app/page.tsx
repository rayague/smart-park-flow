"use client"

import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ParkingsSection } from "@/components/landing/parkings-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { Footer } from "@/components/landing/footer"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuthStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case "admin":
          router.push("/dashboard/admin")
          break
        case "manager":
          router.push("/dashboard/manager")
          break
        default:
          router.push("/dashboard")
      }
    }
  }, [isAuthenticated, user, router])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ParkingsSection />
      <PricingSection />
      <Footer />
      <AuthModal />
    </main>
  )
}
