"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X, Home, Wrench, Calendar, Users, TrendingUp, Settings, BarChart3 } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    email: string
    name: string
    role: string
  }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-gradient-to-r from-red-500 to-pink-500"
      case "TECHNICIAN":
        return "bg-gradient-to-r from-blue-500 to-cyan-500"
      case "USER":
        return "bg-gradient-to-r from-green-500 to-teal-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  const menuItems = [
    { label: "Dashboard", icon: <Home className="w-5 h-5" />, href: "#" },
    { label: "Equipment", icon: <Wrench className="w-5 h-5" />, href: "#" },
    { label: "Requests", icon: <Calendar className="w-5 h-5" />, href: "#" },
    ...(user.role === "ADMIN"
      ? [
          { label: "Teams", icon: <Users className="w-5 h-5" />, href: "#" },
          { label: "Analytics", icon: <TrendingUp className="w-5 h-5" />, href: "#" },
          { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "#" },
        ]
      : []),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-800/40 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MaintenX</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <div className={`${getRoleColor(user.role)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
              {user.role}
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 border-r border-slate-700/50 bg-slate-800/40 backdrop-blur overflow-hidden`}
        >
          <nav className="p-6 space-y-2">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-slate-700/50 hover:text-white transition"
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
