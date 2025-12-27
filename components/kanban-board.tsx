"use client"
import { useState, useEffect } from "react"
import type { DragEndEvent } from "@dnd-kit/core"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle } from "lucide-react"
import { isRequestOverdue } from "@/lib/service/overdue"

interface Request {
  id: string
  subject: string
  status: string
  requestType: string
  scheduledDate: string | null
  equipment: { name: string }
  technician: { name: string; id: string } | null
  createdBy: { name: string }
}

interface KanbanBoardProps {
  requests: Request[]
  onStatusChange: (requestId: string, newStatus: string) => Promise<void>
  loading?: boolean
}

const statuses = ["NEW", "IN_PROGRESS", "REPAIRED", "SCRAP"]

export function KanbanBoard({ requests, onStatusChange, loading = false }: KanbanBoardProps) {
  const [localRequests, setLocalRequests] = useState<Request[]>(requests)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    setLocalRequests(requests)
  }, [requests])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const newStatus = over.id as string
    const requestId = active.id as string

    // Find the request and store its previous state
    const request = localRequests.find((r) => r.id === requestId)
    if (!request) return

    const previousStatus = request.status

    // Optimistic update: Update UI immediately
    setLocalRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    )

    setUpdatingId(requestId)

    try {
      // Call backend API to persist the change
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update status")
      }

      // Notify parent component on success
      await onStatusChange(requestId, newStatus)
    } catch (error) {
      // Rollback: Revert to previous state on failure
      setLocalRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: previousStatus } : r))
      )
      
      console.error("Failed to update request status:", error)
      // Optionally show error toast/notification here
    } finally {
      setUpdatingId(null)
    }
  }

  const groupedRequests = statuses.reduce(
    (acc, status) => {
      acc[status] = localRequests.filter((r) => r.status === status)
      return acc
    },
    {} as Record<string, Request[]>,
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statuses.map((status) => (
        <div key={status} className="flex flex-col space-y-4">
          <div className="bg-muted p-3 rounded-lg">
            <h3 className="font-semibold text-sm mb-1">{status.replace(/_/g, " ")}</h3>
            <p className="text-xs text-muted-foreground">{groupedRequests[status].length} requests</p>
          </div>

          <div className="space-y-3 flex-1">
            {groupedRequests[status].map((request) => (
              <Card
                key={request.id}
                className={`cursor-move transition-all ${updatingId === request.id ? "opacity-50" : ""} ${isRequestOverdue(request) ? "border-destructive" : ""}`}
                draggable
                onDragStart={(e) => e.dataTransfer?.setData("requestId", request.id)}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm line-clamp-2">{request.subject}</h4>
                    {isRequestOverdue(request) && <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />}
                  </div>

                  <p className="text-xs text-muted-foreground">{request.equipment.name}</p>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {request.requestType}
                    </Badge>
                    {request.technician && (
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {request.technician.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
