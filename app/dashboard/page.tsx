"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import Loading from "./loading"

export default function DashboardRoot() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role === "admin") {
      router.push("/dashboard/admin")
    } else if (user.role === "manager") {
      router.push("/dashboard/proprietaire")
    } else {
      router.push("/dashboard/client")
    }
  }, [user, router])

  return <Loading />
}
