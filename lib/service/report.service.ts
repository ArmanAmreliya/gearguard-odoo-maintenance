import { prisma } from "@/lib/db"
import * as XLSX from "xlsx"

interface ReportFilters {
  startDate?: Date
  endDate?: Date
  status?: string
  type?: string
  teamId?: string
}

/**
 * Generate CSV for maintenance requests
 */
export async function generateMaintenanceCSV(filters?: ReportFilters): Promise<string> {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      where: {
        ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
        ...(filters?.endDate && { createdAt: { lte: filters.endDate } }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.type && { requestType: filters.type }),
        ...(filters?.teamId && { maintenanceTeamId: filters.teamId }),
      },
      include: {
        equipment: true,
        technician: true,
        createdBy: true,
        maintenanceTeam: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Prepare CSV headers
    const headers = [
      "ID",
      "Subject",
      "Equipment",
      "Team",
      "Technician",
      "Type",
      "Status",
      "Created By",
      "Created Date",
      "Scheduled Date",
      "Duration (hrs)",
    ]

    // Prepare CSV rows
    const rows = requests.map((req) => [
      req.id.slice(0, 8),
      req.subject,
      req.equipment.name,
      req.maintenanceTeam.name,
      req.technician?.name || "Unassigned",
      req.requestType,
      req.status,
      req.createdBy.name,
      new Date(req.createdAt).toLocaleDateString(),
      req.scheduledDate ? new Date(req.scheduledDate).toLocaleDateString() : "N/A",
      req.durationHours || "N/A",
    ])

    // Create CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    return csvContent
  } catch (error) {
    console.error("Error generating CSV:", error)
    throw error
  }
}

/**
 * Generate Excel workbook for comprehensive report
 */
export async function generateMaintenanceExcel(
  filters?: ReportFilters
): Promise<Buffer> {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      where: {
        ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
        ...(filters?.endDate && { createdAt: { lte: filters.endDate } }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.type && { requestType: filters.type }),
        ...(filters?.teamId && { maintenanceTeamId: filters.teamId }),
      },
      include: {
        equipment: true,
        technician: true,
        createdBy: true,
        maintenanceTeam: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Prepare data for Excel
    const sheetData = requests.map((req) => ({
      ID: req.id.slice(0, 8),
      Subject: req.subject,
      Equipment: req.equipment.name,
      Team: req.maintenanceTeam.name,
      Technician: req.technician?.name || "Unassigned",
      Type: req.requestType,
      Status: req.status,
      "Created By": req.createdBy.name,
      "Created Date": new Date(req.createdAt).toLocaleDateString(),
      "Scheduled Date": req.scheduledDate
        ? new Date(req.scheduledDate).toLocaleDateString()
        : "N/A",
      "Duration (hrs)": req.durationHours || "N/A",
    }))

    // Create workbook
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(sheetData)

    // Style the worksheet
    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 18 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
    ]

    XLSX.utils.book_append_sheet(workbook, worksheet, "Maintenance Requests")

    // Convert to buffer
    return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" })
  } catch (error) {
    console.error("Error generating Excel:", error)
    throw error
  }
}

/**
 * Generate summary statistics report
 */
export async function generateSummaryReport(filters?: ReportFilters) {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      where: {
        ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
        ...(filters?.endDate && { createdAt: { lte: filters.endDate } }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.type && { requestType: filters.type }),
        ...(filters?.teamId && { maintenanceTeamId: filters.teamId }),
      },
      include: {
        equipment: true,
        maintenanceTeam: true,
      },
    })

    const preventiveCount = requests.filter((r) => r.requestType === "PREVENTIVE")
      .length
    const correctiveCount = requests.filter((r) => r.requestType === "CORRECTIVE")
      .length
    const completedCount = requests.filter((r) => r.status === "COMPLETED").length

    const totalDuration = requests.reduce(
      (sum, r) => sum + (r.durationHours || 0),
      0
    )
    const avgDuration = requests.length > 0 ? totalDuration / requests.length : 0

    const equipmentImpacted = new Set(requests.map((r) => r.equipmentId)).size
    const teamsInvolved = new Set(requests.map((r) => r.maintenanceTeamId)).size

    return {
      period: {
        startDate: filters?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: filters?.endDate || new Date(),
      },
      summary: {
        totalRequests: requests.length,
        preventiveCount,
        correctiveCount,
        completedCount,
        completionRate: requests.length > 0 
          ? ((completedCount / requests.length) * 100).toFixed(2) + "%"
          : "0%",
        averageDuration: avgDuration.toFixed(2) + " hrs",
        totalDuration: totalDuration + " hrs",
        equipmentImpacted,
        teamsInvolved,
      },
    }
  } catch (error) {
    console.error("Error generating summary:", error)
    throw error
  }
}

/**
 * Generate team performance report
 */
export async function generateTeamPerformanceReport(filters?: ReportFilters) {
  try {
    const teams = await prisma.maintenanceTeam.findMany({
      include: {
        requests: {
          where: {
            ...(filters?.startDate && {
              createdAt: { gte: filters.startDate },
            }),
            ...(filters?.endDate && { createdAt: { lte: filters.endDate } }),
          },
        },
      },
    })

    const teamPerformance = teams.map((team) => {
      const completedRequests = team.requests.filter(
        (r) => r.status === "COMPLETED"
      ).length
      const totalRequests = team.requests.length
      const completionRate =
        totalRequests > 0 ? ((completedRequests / totalRequests) * 100).toFixed(2) : "0"

      const totalDuration = team.requests.reduce(
        (sum, r) => sum + (r.durationHours || 0),
        0
      )
      const avgDuration =
        totalRequests > 0 ? (totalDuration / totalRequests).toFixed(2) : "0"

      return {
        teamName: team.name,
        totalRequests,
        completedRequests,
        completionRate: parseFloat(completionRate),
        avgDuration: parseFloat(avgDuration as string),
        totalDuration,
      }
    })

    return teamPerformance.sort((a, b) => b.completionRate - a.completionRate)
  } catch (error) {
    console.error("Error generating team performance report:", error)
    throw error
  }
}

/**
 * Generate equipment health report
 */
export async function generateEquipmentHealthReport() {
  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        requests: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
      where: { isScrapped: false },
    })

    const equipmentHealth = equipment.map((eq) => {
      const totalRequests = eq.requests.length
      const lastService = eq.requests[0]?.createdAt || null

      // Simple health calculation based on request frequency
      const daysSinceService = lastService
        ? Math.floor(
            (Date.now() - lastService.getTime()) / (1000 * 60 * 60 * 24)
          )
        : 999

      let healthScore = 100
      if (daysSinceService > 180) healthScore -= 40
      else if (daysSinceService > 90) healthScore -= 20
      else if (daysSinceService > 30) healthScore -= 10

      if (totalRequests > 20) healthScore -= 15
      if (totalRequests > 50) healthScore -= 25

      return {
        equipmentName: eq.name,
        totalRequests,
        lastServiceDaysAgo: daysSinceService,
        healthScore: Math.max(0, healthScore),
        status:
          healthScore >= 80
            ? "Excellent"
            : healthScore >= 60
              ? "Good"
              : healthScore >= 40
                ? "Fair"
                : "Poor",
      }
    })

    return equipmentHealth.sort((a, b) => a.healthScore - b.healthScore)
  } catch (error) {
    console.error("Error generating equipment health report:", error)
    throw error
  }
}
