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

    // 2. Reset auth store (this handles local state and smartpark_token)
    logout()

    // 3. Force clear of potential lingering auth storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("smartpark_token")
      localStorage.removeItem("auth-storage")
      
      // Clear all possible Supabase tokens
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
          localStorage.removeItem(key)
        }
      })
    }

    // 4. Redirect to home with a hard reload to clear any memory state
    window.location.replace("/")
  }, [logout])

  return handleLogout
}
