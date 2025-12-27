import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { KanbanBoard } from "@/components/kanban-board"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RefreshCw, Plus } from "lucide-react"
import Link from "next/link"

/**
 * Technician Kanban View
 * 
 * TECHNICIAN-ONLY: Task-focused maintenance request tracking
 * - Shows only requests assigned to technician or their team
 * - Kanban-style drag-and-drop status management
 * - Highlights overdue requests
 * - Optimistic UI updates with server sync
 * - No-store caching for real-time data
 */

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  priority: "LOW" | "MEDIUM" | "HIGH"
  equipmentId: string
  equipmentName: string
  assignedToId: string | null
  assignedToName: string | null
  teamId: string | null
  dueDate: string
  completedDate: string | null
  createdAt: string
  updatedAt: string
  isOverdue?: boolean
}

async function getKanbanRequests() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Only TECHNICIAN can access this view
  if (session.role !== "TECHNICIAN") {
    redirect("/dashboard")
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  try {
    const res = await fetch(`${baseUrl}/api/requests`, {
      cache: "no-store", // Always fetch fresh data for kanban
      headers: {
        "X-Requested-Role": "TECHNICIAN",
      },
    })

    if (!res.ok) {
      console.error("Failed to fetch requests:", res.statusText)
      return []
    }

    const requests = await res.json()

    // Filter: Only team-assigned requests for technician
    return Array.isArray(requests) ? requests.filter((r: MaintenanceRequest) => {
      return r.teamId === session.teamId || r.assignedToId === session.userId
    }) : []
  } catch (error) {
    console.error("Error fetching requests:", error)
    return []
  }
}

/**
 * Kanban Status Column Header
 */
function ColumnHeader({
  status,
  count,
  icon,
  color,
}: {
  status: string
  count: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className={`flex items-center gap-2 pb-4 border-b-2 ${color}`}>
      {icon}
      <h3 className="font-semibold text-slate-900 dark:text-white">{status}</h3>
      <span className="ml-auto bg-slate-200 dark:bg-slate-700 rounded-full px-2.5 py-0.5 text-sm font-medium text-slate-700 dark:text-slate-300">
        {count}
      </span>
    </div>
  )
}

/**
 * Kanban Board Skeleton
 */
function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((col) => (
        <div key={col} className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[1, 2, 3].map((card) => (
            <Skeleton key={card} className="h-32 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Empty State
 */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
      <p className="text-slate-500 dark:text-slate-400 font-medium">No requests assigned to you</p>
      <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
        Check back later for new maintenance tasks
      </p>
    </div>
  )
}

/**
 * Kanban Page Component
 */
export default async function KanbanPage() {
  const requests = await getKanbanRequests()

  const pending = requests.filter((r: MaintenanceRequest) => r.status === "PENDING")
  const inProgress = requests.filter((r: MaintenanceRequest) => r.status === "IN_PROGRESS")
  const completed = requests.filter((r: MaintenanceRequest) => r.status === "COMPLETED")

  const hasRequests = requests.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                My Maintenance Tasks
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Track and manage your assigned maintenance requests
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="gap-2"
              aria-label="Refresh task list"
              title="Refresh to see latest updates"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {!hasRequests ? (
          <Card>
            <CardContent className="pt-6">
              <EmptyState />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Pending Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {pending.length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {inProgress.length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {completed.length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Kanban Board */}
            <Suspense fallback={<KanbanSkeleton />}>
              <KanbanBoard
                requests={requests}
                onStatusChange={async (requestId: string, newStatus: string) => {
                  // This will be handled by the client component
                  // API call will be made with optimistic update
                }}
                loading={false}
              />
            </Suspense>
          </>
        )}
      </main>
    </div>
  )
}
