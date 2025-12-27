import type { NextRequest } from "next/server"
import { getSession, successResponse, errorResponse } from "@/lib/auth"
import { getEquipmentById, updateEquipment, deleteEquipment } from "@/lib/service/equipment-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const equipment = await getEquipmentById(params.id)
    if (!equipment) return errorResponse("Equipment not found", 404)
    return successResponse(equipment)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    const body = await request.json()
    const equipment = await updateEquipment(params.id, body)
    return successResponse(equipment)
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    await deleteEquipment(params.id)
    return successResponse({ success: true })
  } catch (error: any) {
    return errorResponse(error.message, 500)
  }
}
