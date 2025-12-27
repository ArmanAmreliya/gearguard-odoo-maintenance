"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

type UserRole = "ADMIN" | "TECHNICIAN" | "USER"

interface AuthGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface Session {
  userId: string
  email: string
  name: string | null
  role: UserRole
  teamId: string | null
}

/**
 * AuthGuard Component
 * 
 * Protects child components from rendering when user lacks required roles.
 * - Fetches session from server
 * - Blocks rendering if role not authorized
 * - Shows fallback UI (403 error page)
 * - Handles loading state
 * 
 * Usage:
 * <AuthGuard allowedRoles={["ADMIN"]}>
 *   <AdminPanel />
 * </AuthGuard>
 */
export function AuthGuard({
  allowedRoles,
  children,
  fallback,
}: AuthGuardProps) {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) {
          setIsLoading(false)
          return
        }

        const data = await res.json()
        setSession(data)

        // Check if user role is allowed
        if (allowedRoles.includes(data.role)) {
          setIsAuthorized(true)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [allowedRoles])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Not authorized - show fallback or 403 message
  if (!isAuthorized) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Access Denied
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    You don't have permission to view this page.
                  </p>
                </div>

                <div className="pt-2 text-xs text-slate-500 dark:text-slate-500">
                  {session && (
                    <p>
                      Your role: <span className="font-semibold">{session.role}</span>
                    </p>
                  )}
                  <p className="mt-1">
                    Required: <span className="font-semibold">{allowedRoles.join(", ")}</span>
                  </p>
                </div>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition"
                >
                  Go to Dashboard
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  // ✅ Authorized - render children
  return <>{children}</>
}
