"use client"

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react"

async function getRequests() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  try {
    const res = await fetch(`${baseUrl}/api/requests`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

function RequestsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-20 bg-slate-700/30" />
      ))}
    </div>
  )
}

async function RequestsContent() {
  const requests = await getRequests()

  const statusConfig = {
    PENDING: { icon: Clock, color: "orange", label: "Pending" },
    IN_PROGRESS: { icon: Clock, color: "blue", label: "In Progress" },
    COMPLETED: { icon: CheckCircle2, color: "green", label: "Completed" },
    FAILED: { icon: AlertCircle, color: "red", label: "Failed" },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Maintenance Requests</h1>
          <p className="text-gray-400">View and manage all maintenance requests</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">299</div>
            <p className="text-xs text-green-400 mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">94.3%</div>
            <p className="text-xs text-green-400 mt-2">+2.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">2.4 hrs</div>
            <p className="text-xs text-red-400 mt-2">-3.6% from last month</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">12</div>
            <p className="text-xs text-orange-400 mt-2">Awaiting assignment</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Recent Requests</CardTitle>
          <CardDescription>Latest maintenance requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {requests && requests.length > 0 ? (
            <div className="space-y-3">
              {requests.slice(0, 10).map((req: any, idx: number) => {
                const status = req.status || "PENDING"
                const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
                const StatusIcon = config.icon

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/60 transition group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg flex items-center justify-center border border-blue-500/30">
                          <StatusIcon className={`w-5 h-5 text-blue-400`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium group-hover:text-teal-300 transition">
                            {req.title || `Request #${req.id || idx + 1}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {req.description || "Maintenance task"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-500">
                          {req.createdAt
                            ? new Date(req.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <Badge
                        className={`${
                          config.color === "green"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : config.color === "blue"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : config.color === "orange"
                                ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {config.label}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-teal-400">
                        View
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No requests found</p>
              <Button className="mt-4 bg-gradient-to-r from-teal-500 to-green-500">
                <Plus className="w-4 h-4 mr-2" />
                Create New Request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<RequestsSkeleton />}>
      <RequestsContent />
    </Suspense>
  )
}
