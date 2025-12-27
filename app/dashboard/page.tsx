import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardClient } from "@/components/dashboard-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Calendar, Clock, TrendingUp, AlertCircle, Package, Users, Zap } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardInsights {
  highRiskEquipmentCount: number
  equipmentNeedingMaintenanceSoon: number
  averageDowntimePerEquipment: number
  correctiveVsPreventiveRatio: string
  totalRequests: number
  correctiveCount: number
  preventiveCount: number
  statusCounts: Record<string, number>
  totalEquipment?: number
  activeTeams?: number
}

/**
 * Fetch role-specific dashboard data
 * 
 * - Server-side component: safe to fetch sensitive data
 * - ADMIN: Full metrics and all requests
 * - TECHNICIAN: Team-assigned requests only
 * - USER: User's own requests only
 * - Proper cache headers based on data type
 */
async function getDashboardData() {
  const session = await getSession()
  
  if (!session) {
    redirect("/login")
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // Fetch all data in parallel with appropriate caching
  const [requestsRes, equipmentRes, teamsRes, insightsRes] = await Promise.all([
    fetch(`${baseUrl}/api/requests`, {
      cache: "no-store", // Dynamic user-specific data
    }),
    fetch(`${baseUrl}/api/equipment`, {
      cache: "force-cache",
      next: { revalidate: 60 }, // Equipment data can be cached longer
    }),
    fetch(`${baseUrl}/api/teams`, {
      cache: "force-cache",
      next: { revalidate: 60 },
    }),
    fetch(`${baseUrl}/api/dashboard/insights`, {
      cache: "no-store", // Dynamic metrics - always fresh
    }),
  ])

  const requests = requestsRes.ok ? await requestsRes.json() : []
  const equipment = equipmentRes.ok ? await equipmentRes.json() : []
  const teams = teamsRes.ok ? await teamsRes.json() : []
  const insights = insightsRes.ok ? await insightsRes.json() : null

  // Extract technicians from teams with defensive checks
  const technicians = Array.isArray(teams) 
    ? teams.flatMap((team: any) => Array.isArray(team.members) ? team.members : [])
    : []

  return {
    session,
    requests: Array.isArray(requests) ? requests : [],
    equipment: Array.isArray(equipment) ? equipment : [],
    technicians,
    insights,
  }
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

/**
 * InsightsCards Component
 * 
 * Displays KPI cards with proper null handling and semantic HTML.
 * - Accessible: Uses proper heading hierarchy
 * - Responsive: Grid adapts to screen size
 * - Safe: Defensive checks on all data
 */
function InsightsCards({ insights }: { insights: DashboardInsights | null }) {
  if (!insights) return null

  const pendingCount = insights.statusCounts?.["PENDING"] || 0
  const inProgressCount = insights.statusCounts?.["IN_PROGRESS"] || 0
  const completedCount = insights.statusCounts?.["COMPLETED"] || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Requests Card */}
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <AlertCircle className="w-4 h-4 text-blue-500" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {insights.totalRequests}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            <span className="font-semibold">{pendingCount}</span> pending • 
            <span className="font-semibold ml-1">{inProgressCount}</span> in progress •
            <span className="font-semibold ml-1">{completedCount}</span> completed
          </p>
        </CardContent>
      </Card>

      {/* High-Risk Equipment Card */}
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High-Risk Equipment</CardTitle>
          <AlertTriangle className="w-4 h-4 text-red-600" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {insights.highRiskEquipmentCount}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Requires immediate attention
          </p>
        </CardContent>
      </Card>

      {/* Maintenance Due Card */}
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
          <Calendar className="w-4 h-4 text-amber-600" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {insights.equipmentNeedingMaintenanceSoon}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Due within 7 days
          </p>
        </CardContent>
      </Card>

      {/* Equipment Inventory Card */}
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
          <Package className="w-4 h-4 text-green-600" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {insights.totalEquipment || 0}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Active assets
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="p-6 max-w-7xl mx-auto">
        <Suspense fallback={<DashboardSkeleton />}>
          <InsightsCards insights={data.insights} />
          <DashboardClient
            initialSession={data.session}
            initialRequests={data.requests}
            initialEquipment={data.equipment}
            initialTechnicians={data.technicians}
            initialInsights={data.insights}
          />
        </Suspense>
      </main>
    </div>
  )
}
