import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Users, Wrench, AlertCircle } from "lucide-react"
import Link from "next/link"

interface TeamDetailProps {
  params: Promise<{ id: string }>
}

export default async function TeamDetailPage({ params }: TeamDetailProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const { id } = await params

  try {
    const team = await prisma.maintenanceTeam.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        equipment: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
            department: true,
            isScrapped: true,
            physicalLocation: true,
            _count: {
              select: {
                requests: true,
              },
            },
          },
          take: 12,
        },
        requests: {
          select: {
            id: true,
            subject: true,
            status: true,
            requestType: true,
            createdAt: true,
            equipment: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            members: true,
            equipment: true,
            requests: true,
          },
        },
      },
    })

    if (!team) {
      return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <header className="border-b bg-white dark:bg-slate-900 shadow-sm">
            <div className="px-6 py-4 max-w-7xl mx-auto">
              <Link href="/teams">
                <Button variant="ghost" size="sm" className="gap-2 mb-4">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Teams
                </Button>
              </Link>
            </div>
          </header>
          <main className="p-6 max-w-7xl mx-auto">
            <Card>
              <CardContent className="pt-12 text-center pb-12">
                <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Team Not Found</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">The team you're looking for doesn't exist.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <header className="border-b bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4 max-w-7xl mx-auto">
            <Link href="/teams">
              <Button variant="ghost" size="sm" className="gap-2 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Teams
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{team.name}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Team of {team._count.members} technician{team._count.members !== 1 ? "s" : ""}
            </p>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Team Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">{team._count.members}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Active technicians</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">{team._count.equipment}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Managed items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-slate-900 dark:text-white">{team._count.requests}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Total requests</p>
              </CardContent>
            </Card>
          </div>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Members</span>
                <Badge variant="secondary">{team._count.members}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {team.members.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">No members in this team</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell className="text-sm">{member.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{member.role}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(member.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Managed Equipment */}
          {team.equipment.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Managed Equipment</span>
                  <Badge variant="secondary">{team._count.equipment}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Requests</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.equipment.map((eq) => (
                        <TableRow key={eq.id}>
                          <TableCell className="font-medium">{eq.name}</TableCell>
                          <TableCell className="font-mono text-sm">{eq.serialNumber}</TableCell>
                          <TableCell>{eq.department}</TableCell>
                          <TableCell>{eq.physicalLocation}</TableCell>
                          <TableCell>
                            <Badge
                              variant={eq.isScrapped ? "destructive" : "outline"}
                              className={!eq.isScrapped ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                            >
                              {eq.isScrapped ? "Scrapped" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm font-medium">
                            {eq._count.requests}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {team._count.equipment > 12 && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
                    Showing 12 of {team._count.equipment} equipment items
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recent Requests */}
          {team.requests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Requests</span>
                  <Badge variant="secondary">{team._count.requests}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {team.requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium text-sm">{request.equipment.name}</TableCell>
                          <TableCell className="font-medium">{request.subject}</TableCell>
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
                                request.requestType === "CORRECTIVE"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {request.requestType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-400 text-right">
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
    console.error("Error loading team:", error)
    redirect("/teams")
  }
}
