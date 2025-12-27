"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  BarChart3,
  Users,
  Clock,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Wrench,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

interface UserSession {
  email: string
  name: string
  role: "ADMIN" | "TECHNICIAN" | "USER"
}

interface RolePortalProps {
  user: UserSession
  onLogout?: () => void
}

export function RoleBasedPortal({ user, onLogout }: RolePortalProps) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    onLogout?.()
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

  const getMenuItems = () => {
    const baseItems = [
      { id: "overview", label: "Overview", icon: <Home className="w-5 h-5" /> },
      { id: "maintenance", label: "Maintenance", icon: <Wrench className="w-5 h-5" /> },
      { id: "calendar", label: "Schedule", icon: <Calendar className="w-5 h-5" /> },
    ]

    if (user.role === "ADMIN") {
      baseItems.push({ id: "teams", label: "Teams", icon: <Users className="w-5 h-5" /> })
      baseItems.push({ id: "analytics", label: "Analytics", icon: <TrendingUp className="w-5 h-5" /> })
      baseItems.push({ id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> })
    } else if (user.role === "TECHNICIAN") {
      baseItems.push({ id: "analytics", label: "Analytics", icon: <TrendingUp className="w-5 h-5" /> })
    }

    return baseItems
  }

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
            {getMenuItems().map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-teal-500 to-green-500 text-white"
                    : "text-gray-400 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, {user.name}!</h1>
                  <p className="text-gray-400">Here's your maintenance dashboard overview</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                        Total Requests
                        <Clock className="w-5 h-5 text-orange-400" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">299</div>
                      <p className="text-xs text-green-400 mt-2">+12% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                        Completion Rate
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">94.3%</div>
                      <p className="text-xs text-green-400 mt-2">+2.2% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                        Avg Response Time
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">2.4 hrs</div>
                      <p className="text-xs text-red-400 mt-2">-3.6% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                        Total Cost
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">$586.3K</div>
                      <p className="text-xs text-red-400 mt-2">+8% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription>Latest maintenance requests and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/60 transition"
                        >
                          <div className="w-3 h-3 mt-2 bg-green-400 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-white font-medium">Equipment Maintenance {item}</p>
                            <p className="text-sm text-gray-400 mt-1">Scheduled maintenance completed successfully</p>
                            <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                          </div>
                          <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                            Completed
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === "maintenance" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Maintenance Tasks</h1>
                  <p className="text-gray-400">Manage and track maintenance requests</p>
                </div>

                <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">Active Maintenance Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["Pump Maintenance", "Filter Replacement", "Oil Change"].map((task, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 bg-slate-900/30"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium">{task}</p>
                            <p className="text-sm text-gray-400 mt-1">Equipment ID: EQ-{100 + idx}</p>
                          </div>
                          <Badge variant="outline" className="border-orange-500/50 text-orange-300">
                            In Progress
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === "calendar" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Maintenance Schedule</h1>
                  <p className="text-gray-400">View and manage scheduled maintenance</p>
                </div>

                <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">Upcoming Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["Jan 15", "Jan 22", "Jan 29"].map((date, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 bg-slate-900/30"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium">{date} - Equipment Service</p>
                            <p className="text-sm text-gray-400 mt-1">Scheduled maintenance</p>
                          </div>
                          <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                            Scheduled
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Teams Tab (Admin only) */}
            {activeTab === "teams" && user.role === "ADMIN" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
                  <p className="text-gray-400">Manage maintenance teams and assignments</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {["Facilities Team", "IT Support", "Operations"].map((team, idx) => (
                    <Card key={idx} className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                      <CardHeader>
                        <CardTitle className="text-white">{team}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Members: {5 + idx * 2}</p>
                          <p className="text-sm text-gray-400 mb-2">Active Tasks: {10 + idx * 3}</p>
                          <p className="text-sm text-gray-400">Completion: {85 + idx * 3}%</p>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600">
                          Manage Team
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
                  <p className="text-gray-400">Performance metrics and insights</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white">Request Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-gradient-to-br from-teal-500/20 to-green-500/20 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Chart Placeholder</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white">Cost Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Chart Placeholder</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Settings Tab (Admin only) */}
            {activeTab === "settings" && user.role === "ADMIN" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
                  <p className="text-gray-400">Configure system parameters and preferences</p>
                </div>

                <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/30">
                      <p className="text-white font-medium mb-2">System Status</p>
                      <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                        Operational
                      </Badge>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/30">
                      <p className="text-white font-medium mb-2">Database</p>
                      <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Connected
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
