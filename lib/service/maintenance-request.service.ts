import { prisma } from "@/lib/db"

// Business Rules Validation
export async function validateMaintenanceRequest(
  equipmentId: string,
  maintenanceTeamId: string,
  technicianId?: string,
) {
  // Check equipment exists and not scrapped
  const equipment = await prisma.equipment.findUnique({ where: { id: equipmentId } })
  if (!equipment) throw new Error("Equipment not found")
  if (equipment.isScrapped) throw new Error("Cannot create request for scrapped equipment")

  // Check maintenance team exists
  const team = await prisma.maintenanceTeam.findUnique({ where: { id: maintenanceTeamId } })
  if (!team) throw new Error("Maintenance team not found")

  // If technician provided, validate they belong to the team
  if (technicianId) {
    const technician = await prisma.user.findUnique({ where: { id: technicianId } })
    if (!technician) throw new Error("Technician not found")
    if (technician.teamId !== maintenanceTeamId) {
      throw new Error("Technician does not belong to the assigned team")
    }
  }
}

export async function validateStatusTransition(currentStatus: string, newStatus: string) {
  const validTransitions: Record<string, string[]> = {
    NEW: ["IN_PROGRESS", "SCRAP"],
    IN_PROGRESS: ["REPAIRED", "SCRAP"],
    REPAIRED: [],
    SCRAP: [],
  }

  const allowed = validTransitions[currentStatus] || []
  if (!allowed.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`)
  }
}

export async function handleScrapLogic(requestId: string, equipmentId: string) {
  await prisma.equipment.update({
    where: { id: equipmentId },
    data: { isScrapped: true },
  })
}

export async function isOverdue(request: any): boolean {
  if (!request.scheduledDate) return false
  return new Date(request.scheduledDate) < new Date() && !["REPAIRED", "SCRAP"].includes(request.status)
}

export async function getMaintenanceRequests(teamId?: string, technicianId?: string, status?: string) {
  const where: any = {}

  if (teamId) where.maintenanceTeamId = teamId
  if (technicianId) where.technicianId = technicianId
  if (status) where.status = status

  return prisma.maintenanceRequest.findMany({
    where,
    include: {
      equipment: true,
      maintenanceTeam: true,
      technician: true,
      createdBy: true,
    },
    orderBy: { createdAt: "desc" },
  })
}
