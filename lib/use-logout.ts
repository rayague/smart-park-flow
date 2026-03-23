"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/lib/store"

export function useLogout() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = useCallback(async () => {
    try {
      // 1. Sign out from Supabase
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Supabase signOut error:", error)
    }

    // 2. Clear localStorage items
    if (typeof window !== "undefined") {
      localStorage.removeItem("smartpark_token")
      localStorage.removeItem("auth-storage")
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (url) {
          localStorage.removeItem("sb-" + new URL(url).hostname + "-auth-token")
        }
      } catch {
        // env not set — ignore
      }
    }

    // 3. Reset auth store
    logout()

    // 4. Redirect to home
    window.location.href = "/"
  }, [logout])

  return handleLogout
}
