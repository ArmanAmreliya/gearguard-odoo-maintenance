"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Zap } from "lucide-react"

const DEMO_USERS = [
  {
    email: "admin@gearguard.com",
    name: "Alex Johnson",
    role: "ADMIN",
    description: "Full system access",
  },
  {
    email: "tech@gearguard.com",
    name: "Sarah Williams",
    role: "TECHNICIAN",
    description: "Manage assigned tasks",
  },
  {
    email: "user@gearguard.com",
    name: "David Martinez",
    role: "USER",
    description: "View reports",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function quickLogin(userEmail: string) {
    setError("")
    setLoading(true)
    setEmail(userEmail)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password: "demo" }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }

      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Zap className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent mb-2">
            MaintenX
          </h1>
          <p className="text-gray-400 text-lg">Intelligent Maintenance Management</p>
        </div>

        {/* Login Card */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="bg-red-500/20 border border-red-500/50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <AlertDescription className="text-red-300 ml-2">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-300">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@maintenx.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border border-slate-700/50 bg-slate-900/50 text-white placeholder:text-gray-500 focus:border-teal-500 focus:ring-teal-500/30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-300">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter any password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border border-slate-700/50 bg-slate-900/50 text-white placeholder:text-gray-500 focus:border-teal-500 focus:ring-teal-500/30"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 font-semibold transition-all text-white shadow-lg shadow-teal-500/30"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-slate-800/40 text-gray-400 font-medium">Demo Accounts</span>
              </div>
            </div>

            {/* Quick Login Buttons */}
            <div className="space-y-3">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.email}
                  onClick={() => quickLogin(user.email)}
                  disabled={loading}
                  className="w-full p-4 text-left rounded-lg border border-slate-700/50 bg-slate-900/30 hover:border-teal-500/50 hover:bg-slate-900/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white group-hover:text-teal-300 transition">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user.description}</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-teal-500/20 to-green-500/20 text-teal-300 rounded-full border border-teal-500/30">
                      {user.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
              <div className="flex gap-3 text-sm text-gray-400">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">Demo Mode Enabled</p>
                  <p className="text-xs">Use any password to test different user roles and permissions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          © 2025 MaintenX. All rights reserved.
        </p>
      </div>
    </div>
  )
}
