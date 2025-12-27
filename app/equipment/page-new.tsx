"use client"

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Plus, Zap, TrendingUp } from "lucide-react"

async function getEquipment() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  try {
    const res = await fetch(`${baseUrl}/api/equipment`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

function EquipmentTableSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-16 bg-slate-700/30" />
      ))}
    </div>
  )
}

async function EquipmentContent() {
  const equipment = await getEquipment()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Equipment Management</h1>
          <p className="text-gray-400">Track and manage all maintenance equipment</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Equipment List */}
      <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">All Equipment</CardTitle>
          <CardDescription>Active equipment items and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {equipment && equipment.length > 0 ? (
            <div className="space-y-3">
              {equipment.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/60 transition group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500/30 to-green-500/30 rounded-lg flex items-center justify-center border border-teal-500/30">
                        <Zap className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium group-hover:text-teal-300 transition">
                          {item.name || `Equipment ${idx + 1}`}
                        </p>
                        <p className="text-sm text-gray-500">{item.id || `ID: ${idx + 1}`}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Health</p>
                      <p className="text-lg font-semibold text-green-400">{item.health || "98%"}</p>
                    </div>
                    <Badge
                      className={`${
                        item.status === "active"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                      }`}
                    >
                      {item.status || "Active"}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-teal-400">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No equipment found</p>
              <Button className="mt-4 bg-gradient-to-r from-teal-500 to-green-500">
                <Plus className="w-4 h-4 mr-2" />
                Add First Equipment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{equipment?.length || 0}</div>
            <p className="text-xs text-green-400 mt-2">All operational</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">98.2%</div>
            <p className="text-xs text-green-400 mt-2">Excellent condition</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">
              Maintenance Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">2</div>
            <p className="text-xs text-orange-400 mt-2">Within 30 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function EquipmentPage() {
  return (
    <Suspense fallback={<EquipmentTableSkeleton />}>
      <EquipmentContent />
    </Suspense>
  )
}
