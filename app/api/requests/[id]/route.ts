import type { NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { validateStatusTransition, handleScrapLogic } from "@/lib/service/maintenance-request.service"
import { successResponse, errorResponse } from "@/lib/api-helpers"
import { revalidatePath } from "next/cache"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const req = await prisma.maintenanceRequest.findUnique({
      where: { id: params.id },
      include: {
        equipment: true,
        maintenanceTeam: true,
        technician: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    })

    if (!req) return errorResponse("Request not found", 404)

    return successResponse(req)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const body = await request.json()
    const { status, technicianId, durationHours } = body

    const existing = await prisma.maintenanceRequest.findUnique({ 
      where: { id: params.id },
      include: { equipment: true }
    })
    if (!existing) return errorResponse("Request not found", 404)

    // Validate status transition
    if (status && status !== existing.status) {
      await validateStatusTransition(existing.status, status)
    }

    // Validate technician assignment
    if (technicianId && technicianId !== existing.technicianId) {
      const technician = await prisma.user.findUnique({ where: { id: technicianId } })
      if (!technician || technician.teamId !== existing.maintenanceTeamId) {
        return errorResponse("Technician does not belong to the assigned team", 400)
      }
    }

    // Atomic transaction for scrap cascading or normal update
    const updated = await prisma.$transaction(async (tx) => {
      // Handle scrap status - cascade to equipment
      if (status === "SCRAP" && existing.status !== "SCRAP") {
        await tx.equipment.update({
          where: { id: existing.equipmentId },
          data: { isScrapped: true },
        })
      }

      // Update the maintenance request
      return tx.maintenanceRequest.update({
        where: { id: params.id },
        data: {
          status,
          technicianId,
          durationHours,
        },
        include: {
          equipment: true,
          maintenanceTeam: true,
          technician: { select: { id: true, name: true, email: true } },
          createdBy: { select: { id: true, name: true, email: true } },
        },
      })
    })

    // Revalidate affected routes
    revalidatePath("/dashboard")
    revalidatePath("/equipment")
    
    console.log(`✅ Request ${params.id} updated to ${status}, revalidated pages`)

    return successResponse(updated)
  } catch (error: any) {
    return errorResponse(error.message, 400)
  }
}
