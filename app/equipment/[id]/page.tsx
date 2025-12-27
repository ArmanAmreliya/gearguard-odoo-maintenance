"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Request {
  id: string
  subject: string
  status: string
  requestType: string
  createdAt: string
  technician: { name: string } | null
}

interface EquipmentDetail {
  id: string
  name: string
  serialNumber: string
  department?: string
  assignedEmployee?: string
  physicalLocation?: string
  purchaseDate?: string
  warrantyExpiry?: string
  isScrapped: boolean
  requests: Request[]
  maintenanceTeam: { name: string }
}

export default function EquipmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [equipment, setEquipment] = useState<EquipmentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEquipment()
  }, [params.id])

  async function loadEquipment() {
    try {
      const res = await fetch(`/api/equipment/${params.id}`)
      if (res.ok) {
        setEquipment(await res.json())
      } else {
        router.push("/equipment")
      }
    } catch (error) {
      console.error("Failed to load equipment:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!equipment) {
    return <div className="flex items-center justify-center min-h-screen">Equipment not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/equipment")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{equipment.name}</h1>
            <p className="text-muted-foreground">Serial: {equipment.serialNumber}</p>
          </div>
          <Badge variant={equipment.isScrapped ? "destructive" : "outline"}>
            {equipment.isScrapped ? "Scrapped" : "Active"}
          </Badge>
        </div>

        {equipment.isScrapped && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>This equipment has been scrapped and no new requests can be created.</AlertDescription>
          </Alert>
        )}

        {/* Equipment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Serial Number</p>
                <p className="font-medium">{equipment.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{equipment.department || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned Employee</p>
                <p className="font-medium">{equipment.assignedEmployee || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Physical Location</p>
                <p className="font-medium">{equipment.physicalLocation || "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Maintenance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance Team</p>
                <p className="font-medium">{equipment.maintenanceTeam.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Purchase Date</p>
                <p className="font-medium">
                  {equipment.purchaseDate ? new Date(equipment.purchaseDate).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warranty Expiry</p>
                <p className="font-medium">
                  {equipment.warrantyExpiry ? new Date(equipment.warrantyExpiry).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="font-medium">{equipment.requests.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Requests ({equipment.requests.length})</CardTitle>
            <CardDescription>All maintenance history for this equipment</CardDescription>
          </CardHeader>
          <CardContent>
            {equipment.requests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No maintenance requests yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {request.requestType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "REPAIRED" || request.status === "SCRAP" ? "secondary" : "outline"
                          }
                          className="text-xs"
                        >
                          {request.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{request.technician?.name || "—"}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
