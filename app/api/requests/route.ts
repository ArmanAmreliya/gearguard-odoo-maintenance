import type { NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { validateMaintenanceRequest } from "@/lib/service/maintenance-request.service"
import { successResponse, errorResponse } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const teamId = searchParams.get("teamId") || undefined

    const where: any = {}

    // Role-based filtering
    if (session.role === "TECHNICIAN") {
      where.OR = [{ technicianId: session.userId }, { maintenanceTeam: { id: session.teamId } }]
    } else if (session.role === "USER") {
      where.createdById = session.userId
    }

    if (status) where.status = status
    if (teamId && session.role === "ADMIN") where.maintenanceTeamId = teamId

    const requests = await prisma.maintenanceRequest.findMany({
      where,
      include: {
        equipment: true,
        maintenanceTeam: true,
        technician: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(requests)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const body = await request.json()
    const { subject, equipmentId, requestType, scheduledDate, durationHours, technicianId } = body

    // Get equipment to auto-fill maintenance team
    const equipment = await prisma.equipment.findUnique({ where: { id: equipmentId } })
    if (!equipment) return errorResponse("Equipment not found", 404)
    if (equipment.isScrapped) return errorResponse("Cannot create request for scrapped equipment", 400)

    // Validate the request
    await validateMaintenanceRequest(equipmentId, equipment.maintenanceTeamId, technicianId)

    // Create request
    const newRequest = await prisma.maintenanceRequest.create({
      data: {
        subject,
        equipmentId,
        maintenanceTeamId: equipment.maintenanceTeamId,
        requestType,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        durationHours,
        technicianId,
        createdById: session.userId,
      },
      include: {
        equipment: true,
        maintenanceTeam: true,
        technician: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    })

    return successResponse(newRequest, 201)
  } catch (error: any) {
    return errorResponse(error.message, 400)
  }
}
