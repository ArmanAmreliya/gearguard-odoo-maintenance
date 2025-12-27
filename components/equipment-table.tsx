"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

interface Equipment {
  id: string
  name: string
  location: string
  installDate: Date | null
  lastMaintenanceDate: Date | null
  nextMaintenanceDate: Date | null
  maintenanceInterval: number | null
  isScrapped: boolean
  maintenanceTeam: {
    id: string
    name: string
  } | null
  requestCount: number
}

interface EquipmentTableProps {
  data: Equipment[]
}

export function EquipmentTable({ data }: EquipmentTableProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/equipment/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete")

      router.refresh()
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete equipment")
    } finally {
      setDeleting(null)
    }
  }

  const isOverdue = (date: Date | null) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  const isDueSoon = (date: Date | null) => {
    if (!date) return false
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    return new Date(date) <= sevenDaysFromNow && new Date(date) >= new Date()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Next Maintenance</TableHead>
            <TableHead>Requests</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No equipment found
              </TableCell>
            </TableRow>
          ) : (
            data.map((equipment) => (
              <TableRow key={equipment.id}>
                <TableCell className="font-medium">{equipment.name}</TableCell>
                <TableCell>{equipment.location}</TableCell>
                <TableCell>
                  {equipment.maintenanceTeam ? (
                    <Badge variant="outline">{equipment.maintenanceTeam.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Not assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {equipment.nextMaintenanceDate ? (
                    <div className="flex items-center gap-2">
                      {isOverdue(equipment.nextMaintenanceDate) && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      {isDueSoon(equipment.nextMaintenanceDate) && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                      <span
                        className={
                          isOverdue(equipment.nextMaintenanceDate)
                            ? "text-red-600 font-semibold"
                            : isDueSoon(equipment.nextMaintenanceDate)
                              ? "text-orange-600 font-semibold"
                              : ""
                        }
                      >
                        {format(new Date(equipment.nextMaintenanceDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not scheduled</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{equipment.requestCount}</Badge>
                </TableCell>
                <TableCell>
                  {equipment.isScrapped ? (
                    <Badge variant="destructive">Scrapped</Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-600">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/equipment/${equipment.id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(equipment.id)}
                      disabled={deleting === equipment.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
