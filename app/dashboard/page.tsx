"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { KanbanBoard } from "@/components/kanban-board"
import { MaintenanceRequestModal } from "@/components/maintenance-request-modal"
import { Plus, LogOut, Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

interface Session {
  userId: string
  email: string
  name: string
  role: "ADMIN" | "TECHNICIAN" | "USER"
  teamId: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

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

      const [reqRes, eqRes, teamRes] = await Promise.all([
        fetch(`/api/requests${statusFilter ? `?status=${statusFilter}` : ""}`),
        fetch("/api/equipment"),
        fetch("/api/teams"),
      ])

      if (reqRes.ok) setRequests(await reqRes.json())
      if (eqRes.ok) {
        const eqData = await eqRes.json()
        setEquipment(eqData)
        const techs = eqData.flatMap((eq: any) => eq.maintenanceTeam?.members || [])
        setTechnicians(techs)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateRequest(data: any) {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to create request")

      loadData()
    } catch (error: any) {
      throw error
    }
  }

  async function handleStatusChange(requestId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update request")

      loadData()
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">GearGuard</h1>
            <p className="text-sm text-muted-foreground">
              {session?.name} ({session?.role})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => setModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Request
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/equipment")}>Equipment</DropdownMenuItem>
                {session?.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>Admin Panel</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Maintenance Requests</h2>
        </div>

        <KanbanBoard requests={requests} onStatusChange={handleStatusChange} loading={loading} />

        <MaintenanceRequestModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSubmit={handleCreateRequest}
          equipment={equipment}
          technicians={technicians}
        />
      </main>
    </div>
  )
}
