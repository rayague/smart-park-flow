"use client"

import * as React from "react"
import { useAuthStore } from "@/lib/store"

export function AuthBootstrap() {
  const setInitialized = useAuthStore((s) => s.setInitialized)
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)

  React.useEffect(() => {
    let isMounted = true
    let unsub: { data: { subscription: { unsubscribe: () => void } } } | null = null

    const isAbort = (e: unknown) =>
      e instanceof Error && (e.name === 'AbortError' || e.message?.includes('aborted'))

    const applySession = async (
      userId: string,
      email: string,
      metaName: string,
      metaRole: string,
      accessToken: string,
      getProfile: (id: string) => Promise<any>
    ) => {
      let profile: any = null
      try {
        profile = await getProfile(userId)
      } catch (e) {
        if (isAbort(e)) return  // navigation interrupted — silently bail
      }

      if (!isMounted) return

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
          accessToken
        )
      } else {
        setSession(
          {
            id: userId,
            email,
            name: metaName,
            role: (metaRole || 'user') as 'user' | 'manager' | 'admin',
            createdAt: new Date(),
          },
          accessToken
        )
      }
    }

    const init = async () => {
      try {
        const { getSession, onAuthStateChange, getProfile } = await import("@/lib/auth")

        let session: any = null
        try {
          session = await getSession()
        } catch (e) {
          if (isAbort(e)) return
        }

        if (!isMounted) return

        if (session?.user && session.access_token) {
          await applySession(
            session.user.id,
            session.user.email || "",
            session.user.user_metadata?.name || "",
            ((session.user.user_metadata?.role || "USER") as string).toLowerCase(),
            session.access_token,
            getProfile
          )
        } else {
          clearSession()
        }

        if (!isMounted) return

        unsub = onAuthStateChange(async (_event: string, nextSession: any) => {
          if (!isMounted) return

          if (nextSession?.user && nextSession.access_token) {
            await applySession(
              nextSession.user.id,
              nextSession.user.email || "",
              nextSession.user.user_metadata?.name || "",
              ((nextSession.user.user_metadata?.role || "USER") as string).toLowerCase(),
              nextSession.access_token,
              getProfile
            )
          } else {
            if (isMounted) clearSession()
          }
        })
      } catch (e) {
        if (!isAbort(e)) console.error("[AuthBootstrap] init error:", e)
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
        // ignore
      }
    }
  }, []) // ← empty array: run once only, never re-subscribe

  return null
}
