import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import {
  generateMaintenanceCSV,
  generateMaintenanceExcel,
  generateSummaryReport,
  generateTeamPerformanceReport,
  generateEquipmentHealthReport,
} from "@/lib/service/report.service"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv" // csv, excel
    const type = searchParams.get("type") || "requests" // requests, summary, team, equipment
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined

    const filters = {
      startDate,
      endDate,
    }

    if (type === "requests") {
      if (format === "excel") {
        const buffer = await generateMaintenanceExcel(filters)
        return new NextResponse(buffer, {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition":
              `attachment; filename="maintenance_requests_${new Date().toISOString().slice(0, 10)}.xlsx"`,
          },
        })
      } else {
        const csv = await generateMaintenanceCSV(filters)
        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition":
              `attachment; filename="maintenance_requests_${new Date().toISOString().slice(0, 10)}.csv"`,
          },
        })
      }
    }

    if (type === "summary") {
      const report = await generateSummaryReport(filters)
      return NextResponse.json(report)
    }

    if (type === "team") {
      const report = await generateTeamPerformanceReport(filters)
      return NextResponse.json(report)
    }

    if (type === "equipment") {
      const report = await generateEquipmentHealthReport()
      return NextResponse.json(report)
    }

    return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
