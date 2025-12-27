import type { NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { validateMaintenanceRequest } from "@/lib/service/maintenance-request.service"
import { successResponse, errorResponse } from "@/lib/api-helpers"
import { revalidatePath } from "next/cache"

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
      select: {
        id: true,
        subject: true,
        status: true,
        requestType: true,
        priority: true,
        scheduledDate: true,
        createdAt: true,
        equipment: { select: { id: true, name: true } },
        maintenanceTeam: { select: { id: true, name: true } },
        assignedTechnician: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    // Dynamic data - no cache
    return successResponse(requests, 200, { "Cache-Control": "no-store" })
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

    // Revalidate affected routes
    revalidatePath("/dashboard")
    revalidatePath("/equipment")
    
    console.log("✅ Request created, revalidated dashboard and equipment pages")

    return successResponse(newRequest, 201)
  } catch (error: any) {
    return errorResponse(error.message, 400)
  }
}
