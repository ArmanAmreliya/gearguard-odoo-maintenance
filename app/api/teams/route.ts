import type { NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const teams = await prisma.maintenanceTeam.findMany({
      include: {
        members: { select: { id: true, name: true, email: true, role: true } },
        _count: {
          select: { equipment: true, requests: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return successResponse(teams)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
