import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Package, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"

/**
 * Equipment Management Page
 * 
 * ADMIN-ONLY: View and manage equipment inventory
 * - Server-side data fetching with auth check
 * - Role-based access control
 * - Direct database queries (optimal performance)
 * - Displays 10-12 equipment records with full details
 */

async function getEquipment() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Only ADMIN can access equipment management
  if (session.role !== "ADMIN") {
    redirect("/dashboard")
  }

  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        maintenanceTeam: true,
        _count: {
          select: { requests: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Get up to 50 records
    })

    return equipment.map((eq) => ({
      id: eq.id,
      name: eq.name,
      serialNumber: eq.serialNumber,
      department: eq.department || "—",
      physicalLocation: eq.physicalLocation || "—",
      isScrapped: eq.isScrapped,
      maintenanceTeam: eq.maintenanceTeam,
      requestCount: eq._count?.requests || 0,
      createdAt: eq.createdAt?.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching equipment:", error)
    return []
  }
}

export default async function EquipmentPage() {
  const equipment = await getEquipment()
  const activeEquipment = equipment.filter(e => !e.isScrapped)
  const scrapedEquipment = equipment.filter(e => e.isScrapped)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Equipment Inventory</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage all equipment and track maintenance
            </p>
          </div>
          <Link href="/equipment/new">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Equipment
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {equipment.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No equipment found</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Add your first equipment to start tracking maintenance
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{equipment.length}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Equipment</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{activeEquipment.length}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Active</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{scrapedEquipment.length}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Scrapped</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Equipment Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Equipment</span>
                  <Badge variant="secondary">{equipment.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipment.map((item) => (
                        <TableRow
                          key={item.id}
                          className={item.isScrapped ? "opacity-50 bg-slate-50 dark:bg-slate-800/50" : ""}
                        >
                          <TableCell className="font-medium text-slate-900 dark:text-white">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                            {item.serialNumber}
                          </TableCell>
                          <TableCell className="text-sm">{item.department}</TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                            {item.physicalLocation}
                          </TableCell>
                          <TableCell className="text-sm">
                            {item.maintenanceTeam ? (
                              <Badge variant="outline">{item.maintenanceTeam.name}</Badge>
                            ) : (
                              <span className="text-slate-500 dark:text-slate-400">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.isScrapped ? (
                              <Badge variant="destructive">Scrapped</Badge>
                            ) : (
                              <Badge variant="default" className="bg-green-600">
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/equipment/${item.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={item.isScrapped}
                                  title={item.isScrapped ? "Cannot edit scrapped equipment" : "View details"}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={item.isScrapped}
                                title={item.isScrapped ? "Cannot delete scrapped equipment" : "Delete equipment"}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
