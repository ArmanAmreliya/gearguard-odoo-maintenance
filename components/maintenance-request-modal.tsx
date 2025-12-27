"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Equipment {
  id: string
  name: string
  maintenanceTeamId: string
}

interface Technician {
  id: string
  name: string
  teamId: string
}

interface MaintenanceRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
  equipment: Equipment[]
  technicians: Technician[]
}

export function MaintenanceRequestModal({
  open,
  onOpenChange,
  onSubmit,
  equipment,
  technicians,
}: MaintenanceRequestModalProps) {
  const [subject, setSubject] = useState("")
  const [equipmentId, setEquipmentId] = useState("")
  const [requestType, setRequestType] = useState<"CORRECTIVE" | "PREVENTIVE">("CORRECTIVE")
  const [scheduledDate, setScheduledDate] = useState("")
  const [durationHours, setDurationHours] = useState("")
  const [technicianId, setTechnicianId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const selectedEquipment = equipment.find((e) => e.id === equipmentId)
  const availableTechnicians = selectedEquipment
    ? technicians.filter((t) => t.teamId === selectedEquipment.maintenanceTeamId)
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await onSubmit({
        subject,
        equipmentId,
        requestType,
        scheduledDate: requestType === "PREVENTIVE" ? scheduledDate : null,
        durationHours: durationHours ? Number.parseInt(durationHours) : null,
        technicianId: technicianId || null,
      })

      // Reset form
      setSubject("")
      setEquipmentId("")
      setRequestType("CORRECTIVE")
      setScheduledDate("")
      setDurationHours("")
      setTechnicianId("")
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to create request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Maintenance Request</DialogTitle>
          <DialogDescription>Add a new maintenance request for your equipment</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              placeholder="Brief description of the issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Equipment</label>
            <Select value={equipmentId} onValueChange={setEquipmentId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipment.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Request Type</label>
            <Select value={requestType} onValueChange={(v: any) => setRequestType(v)} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                <SelectItem value="PREVENTIVE">Preventive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {requestType === "PREVENTIVE" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Scheduled Date</label>
              <Input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (hours)</label>
            <Input
              type="number"
              placeholder="Estimated hours"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
            />
          </div>

          {selectedEquipment && availableTechnicians.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Technician (Optional)</label>
              <Select value={technicianId} onValueChange={setTechnicianId}>
                <SelectTrigger>
                  <SelectValue placeholder="Leave unassigned" />
                </SelectTrigger>
                <SelectContent>
                  {availableTechnicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
