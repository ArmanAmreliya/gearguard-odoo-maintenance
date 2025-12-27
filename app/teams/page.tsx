import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Users2, Wrench } from "lucide-react"
import Link from "next/link"

export default async function TeamsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const teams = await prisma.maintenanceTeam.findMany({
    include: {
      members: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      _count: {
        select: {
          equipment: true,
          requests: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  const stats = {
    totalTeams: teams.length,
    totalMembers: teams.reduce((sum, t) => sum + (t.members?.length || 0), 0),
    totalRequests: teams.reduce((sum, t) => sum + (t._count?.requests || 0), 0),
    equipmentManaged: teams.reduce((sum, t) => sum + (t._count?.equipment || 0), 0),
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-40">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Maintenance Teams</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Manage teams and track their equipment assignments</p>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalTeams}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Teams</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalMembers}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Technicians</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Wrench className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.equipmentManaged}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Equipment</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalRequests}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Requests</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No teams yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Create your first maintenance team to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Link key={team.id} href={`/teams/${team.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        {team.members?.length || 0}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Team Members List */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Members</h4>
                      <div className="space-y-2">
                        {(team.members || []).slice(0, 3).map((member) => (
                          <div key={member.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700 dark:text-slate-300">{member.name}</span>
                            <Badge variant="outline" className="text-xs">{member.role}</Badge>
                          </div>
                        ))}
                        {(team.members?.length || 0) > 3 && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 pt-2">
                            +{(team.members?.length || 0) - 3} more
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {team._count?.equipment || 0}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Equipment</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {team._count?.requests || 0}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Requests</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
