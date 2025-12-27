"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Equipment {
  id: string
  name: string
  serialNumber: string
  department?: string
  assignedEmployee?: string
  physicalLocation?: string
  isScrapped: boolean
  _count: {
    requests: number
  }
}

interface Session {
  userId: string
  role: "ADMIN" | "TECHNICIAN" | "USER"
}

export default function EquipmentPage() {
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const sessionRes = await fetch("/api/auth/session")
      if (!sessionRes.ok) {
        router.push("/login")
        return
      }

      const sessionData = await sessionRes.json()
      setSession(sessionData)

      const eqRes = await fetch("/api/equipment")
      if (eqRes.ok) {
        setEquipment(await eqRes.json())
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Equipment Inventory</h1>
            <p className="text-muted-foreground">Manage and track all equipment and assets</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Equipment</CardTitle>
            <CardDescription>Total: {equipment.length} items</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Requests</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.serialNumber}</TableCell>
                    <TableCell>{item.department || "—"}</TableCell>
                    <TableCell className="text-sm">{item.physicalLocation || "—"}</TableCell>
                    <TableCell>
                      {item.isScrapped ? (
                        <Badge variant="destructive">Scrapped</Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item._count.requests}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/equipment/${item.id}`)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
