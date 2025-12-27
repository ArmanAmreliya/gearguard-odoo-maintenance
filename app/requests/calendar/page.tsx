import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { CalendarView } from "@/components/calendar-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Calendar } from "lucide-react"

/**
 * Technician Calendar View
 * 
 * TECHNICIAN-ONLY: Schedule-focused preventive maintenance view
 * - Shows only preventive maintenance requests
 * - Highlights today and overdue dates
 * - Prevents editing of past dates
 * - Syncs with backend data in real-time
 * - Server-side filtering for performance
 */

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  type: "PREVENTIVE" | "CORRECTIVE"
  dueDate: string
  completedDate: string | null
  priority: "LOW" | "MEDIUM" | "HIGH"
  equipmentName: string
  assignedToId: string | null
  assignedToName: string | null
  teamId: string | null
  createdAt: string
}

async function getCalendarRequests() {
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
      cache: "no-store", // Always fetch fresh data for scheduling
      headers: {
        "X-Requested-Role": "TECHNICIAN",
      },
    })

    if (!res.ok) {
      console.error("Failed to fetch requests:", res.statusText)
      return []
    }

    const requests = await res.json()

    // Filter: Only preventive requests assigned to technician/team
    return Array.isArray(requests)
      ? requests.filter((r: MaintenanceRequest) => {
          const isAssigned =
            r.teamId === session.teamId || r.assignedToId === session.userId
          const isPreventive = r.type === "PREVENTIVE"
          return isAssigned && isPreventive
        })
      : []
  } catch (error) {
    console.error("Error fetching calendar requests:", error)
    return []
  }
}

/**
 * Get upcoming maintenance dates
 */
function getUpcomingDates(requests: MaintenanceRequest[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = requests.filter((r) => {
    const dueDate = new Date(r.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate >= today && r.status !== "COMPLETED"
  })

  return upcoming.sort(
    (a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )
}

/**
 * Calendar Skeleton
 */
function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

/**
 * Upcoming Events List
 */
function UpcomingEventsList({
  requests,
}: {
  requests: MaintenanceRequest[]
}) {
  const upcoming = getUpcomingDates(requests)

  if (upcoming.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No upcoming preventive maintenance
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              You're all caught up!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcoming.slice(0, 5).map((request) => {
            const dueDate = new Date(request.dueDate)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const isOverdue = dueDate < today

            return (
              <div
                key={request.id}
                className={`p-3 rounded-lg border-l-4 ${
                  isOverdue
                    ? "border-l-red-500 bg-red-50 dark:bg-red-950"
                    : "border-l-blue-500 bg-blue-50 dark:bg-blue-950"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {request.title}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {request.equipmentName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {dueDate.toLocaleDateString()}
                    </p>
                    {isOverdue && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                        OVERDUE
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Calendar Page Component
 */
export default async function CalendarPage() {
  const requests = await getCalendarRequests()
  const hasRequests = requests.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Maintenance Calendar
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Schedule and track preventive maintenance tasks
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {!hasRequests ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  No preventive maintenance scheduled
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Check back when new preventive maintenance tasks are assigned
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Suspense fallback={<CalendarSkeleton />}>
                <CalendarView events={requests} />
              </Suspense>
            </div>

            <div>
              <Suspense fallback={<Skeleton className="h-80 w-full" />}>
                <UpcomingEventsList requests={requests} />
              </Suspense>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
