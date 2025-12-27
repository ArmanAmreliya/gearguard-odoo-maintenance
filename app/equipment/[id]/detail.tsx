import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Wrench, AlertCircle, Calendar } from "lucide-react"
import Link from "next/link"

interface EquipmentDetailProps {
  params: Promise<{ id: string }>
}

export default async function EquipmentDetailPage({ params }: EquipmentDetailProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const { id } = await params

  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        maintenanceTeam: true,
        requests: {
          include: {
            assignedTo: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 12,
        },
        _count: {
          select: {
            requests: true,
          },
        },
      },
    })

    if (!equipment) {
      return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <header className="border-b bg-white dark:bg-slate-900 shadow-sm">
            <div className="px-6 py-4 max-w-7xl mx-auto">
              <Link href="/equipment">
                <Button variant="ghost" size="sm" className="gap-2 mb-4">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Equipment
                </Button>
              </Link>
            </div>
          </header>
          <main className="p-6 max-w-7xl mx-auto">
            <Card>
              <CardContent className="pt-12 text-center pb-12">
                <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Equipment Not Found</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">The equipment you're looking for doesn't exist.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      )
    }

    const lastServicedRequest = equipment.requests.find(
      (r) => r.status === "COMPLETED"
    )

    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <header className="border-b bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 max-w-7xl mx-auto">
            <Link href="/equipment">
              <Button variant="ghost" size="sm" className="gap-2 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Equipment
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{equipment.name}</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Serial: {equipment.serialNumber}
                </p>
              </div>
              <div className="flex gap-2">
                {equipment.isScrapped && <Badge variant="destructive">Scrapped</Badge>}
                {!equipment.isScrapped && <Badge className="bg-green-600">Active</Badge>}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Equipment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Equipment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400">Department</label>
                  <p className="text-base font-medium text-slate-900 dark:text-white">{equipment.department}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400">Physical Location</label>
                  <p className="text-base font-medium text-slate-900 dark:text-white">{equipment.physicalLocation}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400">Maintenance Team</label>
                  {equipment.maintenanceTeam ? (
                    <p className="text-base font-medium">
                      <Badge>{equipment.maintenanceTeam.name}</Badge>
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">Unassigned</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Maintenance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400">Total Requests</label>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{equipment._count.requests}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400">Last Serviced</label>
                  {lastServicedRequest ? (
                    <p className="text-base font-medium">
                      {new Date(lastServicedRequest.completedDate || lastServicedRequest.createdAt).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">Never serviced</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance Requests Table */}
          {equipment.requests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Maintenance Requests</span>
                  <Badge variant="secondary">{equipment._count.requests}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipment.requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-mono text-sm">{request.id.slice(0, 8)}</TableCell>
                          <TableCell className="font-medium">{request.title}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.status === "COMPLETED"
                                  ? "default"
                                  : request.status === "IN_PROGRESS"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.priority === "HIGH"
                                  ? "destructive"
                                  : request.priority === "MEDIUM"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {request.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    )
  } catch (error) {
    console.error("Error loading equipment:", error)
    redirect("/equipment")
  }
}
