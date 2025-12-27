import type { NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get("teamId") || undefined

    const where: any = {}
    if (teamId) where.maintenanceTeamId = teamId

    const equipment = await prisma.equipment.findMany({
      where,
      include: {
        maintenanceTeam: true,
        _count: {
          select: { requests: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return successResponse(equipment)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  if (session.role !== "ADMIN") {
    return errorResponse("Only admins can create equipment", 403)
  }

  try {
    const body = await request.json()
    const {
      name,
      serialNumber,
      department,
      assignedEmployee,
      physicalLocation,
      purchaseDate,
      warrantyExpiry,
      maintenanceTeamId,
    } = body

    const equipment = await prisma.equipment.create({
      data: {
        name,
        serialNumber,
        department,
        assignedEmployee,
        physicalLocation,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined,
        maintenanceTeamId,
      },
      include: {
        maintenanceTeam: true,
      },
    })

    return successResponse(equipment, 201)
  } catch (error: any) {
    return errorResponse(error.message, 400)
  }
}
