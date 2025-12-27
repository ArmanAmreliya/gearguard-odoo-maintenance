import type { NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-helpers"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id: params.id },
      include: {
        maintenanceTeam: true,
        requests: {
          include: {
            technician: { select: { id: true, name: true, email: true } },
            createdBy: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!equipment) return errorResponse("Equipment not found", 404)

    return successResponse(equipment)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
