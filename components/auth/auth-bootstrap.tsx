"use client"

import * as React from "react"
import { useAuthStore } from "@/lib/store"

export function AuthBootstrap() {
  const { setInitialized, setSession, clearSession } = useAuthStore()

  React.useEffect(() => {
    let unsub: { data: { subscription: { unsubscribe: () => void } } } | null = null
    let isMounted = true

    const init = async () => {
      try {
        const { getSession, onAuthStateChange, getProfile } = await import("@/lib/auth")

        const session = await getSession().catch(() => null)
        if (!isMounted) return

        if (session?.user && session.access_token) {
          const profile = await getProfile(session.user.id).catch(() => null)

          if (profile) {
            setSession(
              {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role.toLowerCase() as 'user' | 'manager' | 'admin',
                avatar: profile.avatar_url ?? undefined,
                createdAt: new Date(profile.created_at),
              },
              session.access_token
            )
          } else {
            setSession(
              {
                id: session.user.id,
                email: session.user.email || "",
                name: session.user.user_metadata?.name || "",
                role: ((session.user.user_metadata?.role || "USER") as string).toLowerCase() as 'user' | 'manager' | 'admin',
                createdAt: new Date(),
              },
              session.access_token
            )
          }
        } else {
          clearSession()
        }

        unsub = onAuthStateChange(async (_event, nextSession) => {
          if (!isMounted) return

          if (nextSession?.user && nextSession.access_token) {
            const profile = await getProfile(nextSession.user.id).catch(() => null)

            if (profile) {
              setSession(
                {
                  id: profile.id,
                  email: profile.email,
                  name: profile.name,
                  role: profile.role.toLowerCase() as 'user' | 'manager' | 'admin',
                  avatar: profile.avatar_url ?? undefined,
                  createdAt: new Date(profile.created_at),
                },
                nextSession.access_token
              )
            } else {
              setSession(
                {
                  id: nextSession.user.id,
                  email: nextSession.user.email || "",
                  name: nextSession.user.user_metadata?.name || "",
                  role: ((nextSession.user.user_metadata?.role || "USER") as string).toLowerCase() as 'user' | 'manager' | 'admin',
                  createdAt: new Date(),
                },
                nextSession.access_token
              )
            }
          } else {
            clearSession()
          }
        })
      } finally {
        if (isMounted) setInitialized(true)
      }
    }

    init()

    return () => {
      isMounted = false
      try {
        unsub?.data.subscription.unsubscribe()
      } catch {
      }
    }
  }, [clearSession, setInitialized, setSession])

  return null
}
