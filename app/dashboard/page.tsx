"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import Loading from "./loading"

export default function DashboardRoot() {
  const router = useRouter()
  const { user, initialized } = useAuthStore()

  useEffect(() => {
    if (!initialized) return

    if (!user) {
      router.push("/login")
      return
    }

    if (user.role === "admin") {
      router.push("/dashboard/admin")
    } else if (user.role === "manager") {
      router.push("/dashboard/manager")
    } else {
      router.push("/dashboard/client")
    }
  }, [initialized, user, router])

  return <Loading />
}
