import { NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-helpers"
import { evaluateEquipmentHealth } from "@/lib/service/equipment-health"

export const dynamic = 'force-dynamic' // No caching for insights

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse("Unauthorized", 401)

  try {
    // Fetch all equipment with optimized query
    const allEquipment = await prisma.equipment.findMany({
      select: {
        id: true,
        name: true,
        maintenanceRequests: {
          select: {
            id: true,
            status: true,
            requestType: true,
            createdAt: true,
            durationHours: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    // Calculate health for each equipment
    const equipmentWithHealth = allEquipment.map((equipment) => {
      const health = evaluateEquipmentHealth(equipment.requests)
      return {
        id: equipment.id,
        name: equipment.name,
        health,
        requestCount: equipment.requests.length,
      }
    })

    // Calculate dashboard metrics
    const highRiskEquipment = equipmentWithHealth.filter((eq) => eq.health.riskLevel === "HIGH")
    
    // Equipment needing preventive maintenance within 7 days
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    
    const needsPreventiveSoon = equipmentWithHealth.filter((eq) => {
      if (!eq.health.suggestedNextMaintenanceDate) return false
      const nextDate = new Date(eq.health.suggestedNextMaintenanceDate)
      const now = new Date()
      return nextDate >= now && nextDate <= sevenDaysFromNow
    })

    // Get all requests for corrective vs preventive ratio
    const allRequests = await prisma.maintenanceRequest.findMany({
      select: {
        requestType: true,
        durationHours: true,
      },
    })

    const correctiveCount = allRequests.filter((r) => r.requestType === "CORRECTIVE").length
    const preventiveCount = allRequests.filter((r) => r.requestType === "PREVENTIVE").length
    const correctiveVsPreventiveRatio = preventiveCount > 0 
      ? (correctiveCount / preventiveCount).toFixed(2) 
      : correctiveCount.toString()

    // Calculate average downtime per equipment
    const totalDowntime = allRequests.reduce((sum, r) => sum + (r.durationHours || 0), 0)
    const equipmentWithRequests = allEquipment.filter((eq) => eq.requests.length > 0)
    const averageDowntimePerEquipment = equipmentWithRequests.length > 0
      ? (totalDowntime / equipmentWithRequests.length).toFixed(1)
      : "0"

    // Total requests overview
    const totalRequests = allRequests.length
    const requestsByStatus = await prisma.maintenanceRequest.groupBy({
      by: ["status"],
      _count: { status: true },
    })

    const statusCounts = requestsByStatus.reduce(
      (acc, item) => {
        acc[item.status.toLowerCase()] = item._count.status
        return acc
      },
      {} as Record<string, number>
    )

    const insights = {
      highRiskEquipmentCount: highRiskEquipment.length,
      equipmentNeedingMaintenanceSoon: needsPreventiveSoon.length,
      averageDowntimePerEquipment: parseFloat(averageDowntimePerEquipment),
      correctiveVsPreventiveRatio: parseFloat(correctiveVsPreventiveRatio),
      totalRequests,
      correctiveCount,
      preventiveCount,
      statusCounts,
      highRiskEquipmentList: highRiskEquipment.map((eq) => ({
        id: eq.id,
        name: eq.name,
        riskLevel: eq.health.riskLevel,
        reasoning: eq.health.reasoning,
      })),
      upcomingMaintenanceList: needsPreventiveSoon.map((eq) => ({
        id: eq.id,
        name: eq.name,
        suggestedDate: eq.health.suggestedNextMaintenanceDate,
      })),
    }

    return successResponse(insights)
  } catch (error: any) {
    console.error("Dashboard insights error:", error)
    return errorResponse(error.message, 500)
  }
}
