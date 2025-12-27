import type { NextRequest } from "next/server"
import { getSession, successResponse, errorResponse } from "@/lib/auth"
import { getAllEquipment, createEquipment } from "@/lib/service/equipment-service"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const equipment = await getAllEquipment()
    // Public equipment data - cache for 60 seconds
    return successResponse(equipment, 200, { "Cache-Control": "public, max-age=60, s-maxage=60" })
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const body = await request.json()
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
