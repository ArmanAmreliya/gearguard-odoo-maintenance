import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Clock, CheckCircle2, Eye, Plus } from "lucide-react"
import Link from "next/link"

/**
 * User Requests List
 * 
 * USER-ONLY: View personal maintenance requests
 * - Shows only requests created by the user
 * - Read-only view (no mutations allowed)
 * - Status timeline and history
 * - Safe defensive rendering
 * - Responsive layout
 */

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  priority: "LOW" | "MEDIUM" | "HIGH"
  equipmentName: string
  createdAt: string
  dueDate: string
  completedDate: string | null
  estimatedCost?: number
}

async function getUserRequests() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Only USER can access this page
  if (session.role !== "USER") {
    redirect("/dashboard")
  }

  try {
    const requests = await prisma.maintenanceRequest.findMany({
      where: {
        createdById: session.userId,
      },
      include: {
        equipment: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return requests.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      priority: r.priority,
      equipmentId: r.equipmentId,
      equipmentName: r.equipment?.name || "Unknown Equipment",
      createdById: r.createdById,
      createdAt: r.createdAt.toISOString(),
      dueDate: r.dueDate.toISOString(),
      completedDate: r.completedDate?.toISOString() || null,
      estimatedCost: r.estimatedCost,
    }))
  } catch (error) {
    console.error("Error fetching requests:", error)
    return []
  }
}

/**
 * Status Badge Component
 * Visual indicator for request status
 */
function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { bg: string; text: string; icon: React.ReactNode }
  > = {
    PENDING: {
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-800 dark:text-yellow-200",
      icon: <AlertCircle className="w-3 h-3" />,
    },
    IN_PROGRESS: {
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-200",
      icon: <Clock className="w-3 h-3" />,
    },
    COMPLETED: {
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-800 dark:text-green-200",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
  }

  const c = config[status] || config.PENDING

  return (
    <Badge className={`${c.bg} ${c.text} gap-1.5`}>
      {c.icon}
      {status}
    </Badge>
  )
}

/**
 * Priority Badge Component
 */
function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, string> = {
    LOW: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
    MEDIUM: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
    HIGH: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  }

  return (
    <Badge className={config[priority] || config.LOW}>
      {priority}
    </Badge>
  )
}

/**
 * Requests Table Skeleton
 */
function RequestsTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

/**
 * Requests Table
 * Read-only display with proper ARIA labels
 */
function RequestsTable({ requests }: { requests: MaintenanceRequest[] }) {
  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              No requests yet
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Create a new maintenance request to get started
            </p>
            <Link href="/requests/new">
              <Button className="mt-4 gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Create Request
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-slate-50 dark:bg-slate-800/50">
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Equipment</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Priority</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="font-semibold">Due Date</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.id}
              className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <TableCell className="font-medium text-slate-900 dark:text-white max-w-xs truncate">
                {request.title}
              </TableCell>
              <TableCell className="text-slate-600 dark:text-slate-400">
                {request.equipmentName}
              </TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={request.priority} />
              </TableCell>
              <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                {new Date(request.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                {new Date(request.dueDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/requests/${request.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    aria-label={`View details for ${request.title}`}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

/**
 * Requests Page Header
 */
function RequestsHeader({
  totalCount,
  pendingCount,
}: {
  totalCount: number
  pendingCount: number
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Requests
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Track your maintenance requests and their status
        </p>
      </div>
      <Link href="/requests/new">
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </Link>
    </div>
  )
}

/**
 * Request Stats Cards
 */
function RequestStats({
  requests,
}: {
  requests: MaintenanceRequest[]
}) {
  const total = requests.length
  const pending = requests.filter((r) => r.status === "PENDING").length
  const inProgress = requests.filter((r) => r.status === "IN_PROGRESS").length
  const completed = requests.filter((r) => r.status === "COMPLETED").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {total}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {pending}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {inProgress}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {completed}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Main Requests Page
 * Server component for safe data fetching
 */
export default async function RequestsPage() {
  const requests = await getUserRequests()

  const pending = requests.filter((r) => r.status === "PENDING").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <RequestsHeader totalCount={requests.length} pendingCount={pending} />
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <RequestStats requests={requests} />

        <Suspense fallback={<RequestsTableSkeleton />}>
          <RequestsTable requests={requests} />
        </Suspense>
      </main>
    </div>
  )
}
