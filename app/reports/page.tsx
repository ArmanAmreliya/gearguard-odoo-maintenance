"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  FileText,
  BarChart3,
  Users,
  Zap,
  Calendar,
  Filter,
} from "lucide-react"

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("requests")
  const [exportFormat, setExportFormat] = useState("csv")
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [summaryData, setSummaryData] = useState<any>(null)
  const [teamData, setTeamData] = useState<any>(null)
  const [equipmentData, setEquipmentData] = useState<any>(null)

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates")
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: selectedReport,
        format: exportFormat,
        startDate,
        endDate,
      })

      const response = await fetch(`/api/reports/export?${params}`)

      if (selectedReport === "requests") {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `maintenance_requests_${new Date().toISOString().slice(0, 10)}.${exportFormat}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const data = await response.json()
        if (selectedReport === "summary") {
          setSummaryData(data)
        } else if (selectedReport === "team") {
          setTeamData(data)
        } else if (selectedReport === "equipment") {
          setEquipmentData(data)
        }
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to generate report")
    } finally {
      setLoading(false)
    }
  }

  const reportTypes = [
    {
      id: "requests",
      name: "Maintenance Requests",
      icon: FileText,
      description: "Export all maintenance requests with full details",
      downloadable: true,
    },
    {
      id: "summary",
      name: "Summary Report",
      icon: BarChart3,
      description: "Overview of maintenance statistics and trends",
      downloadable: false,
    },
    {
      id: "team",
      name: "Team Performance",
      icon: Users,
      description: "Team metrics and completion rates",
      downloadable: false,
    },
    {
      id: "equipment",
      name: "Equipment Health",
      icon: Zap,
      description: "Equipment status and health scores",
      downloadable: false,
    },
  ]

  const currentReport = reportTypes.find((r) => r.id === selectedReport)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-teal-400" />
            <h1 className="text-4xl font-bold text-white">Reports & Export</h1>
          </div>
          <p className="text-slate-400">
            Generate and export maintenance reports in multiple formats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Report Selection */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-teal-400" />
                  Report Type
                </h2>

                <div className="space-y-2">
                  {reportTypes.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => {
                        setSelectedReport(report.id)
                        setSummaryData(null)
                        setTeamData(null)
                        setEquipmentData(null)
                      }}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedReport === report.id
                          ? "border-teal-400 bg-slate-700"
                          : "border-slate-700 hover:border-slate-600 bg-slate-900"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <report.icon
                          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            selectedReport === report.id
                              ? "text-teal-400"
                              : "text-slate-400"
                          }`}
                        />
                        <div>
                          <div
                            className={`font-medium ${
                              selectedReport === report.id
                                ? "text-white"
                                : "text-slate-300"
                            }`}
                          >
                            {report.name}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {report.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Options and Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Export Options */}
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Export Options
                </h3>

                <div className="space-y-4">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-400" />
                        Date Range
                      </div>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  {/* Export Format (Only for downloadable reports) */}
                  {currentReport?.downloadable && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Export Format
                      </label>
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="csv">CSV (.csv)</SelectItem>
                          <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Export Button */}
                  <Button
                    onClick={handleExport}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        {currentReport?.downloadable
                          ? "Download Report"
                          : "Generate Report"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Preview Sections */}
            {summaryData && (
              <Card className="bg-slate-800 border-slate-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Summary Report
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-900 p-3 rounded-lg">
                      <div className="text-slate-400 text-xs font-medium">
                        Total Requests
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {summaryData.totalRequests}
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg">
                      <div className="text-slate-400 text-xs font-medium">
                        Completed
                      </div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {summaryData.completedRequests}
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg">
                      <div className="text-slate-400 text-xs font-medium">
                        Completion Rate
                      </div>
                      <div className="text-2xl font-bold text-blue-400">
                        {summaryData.completionRate}%
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg">
                      <div className="text-slate-400 text-xs font-medium">
                        Avg Response Time
                      </div>
                      <div className="text-2xl font-bold text-purple-400">
                        {summaryData.avgResponseTime?.toFixed(1) || 0}h
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-slate-900 p-3 rounded-lg">
                      <Badge className="bg-blue-500/20 text-blue-300 mb-2">
                        Preventive
                      </Badge>
                      <div className="text-2xl font-bold text-white">
                        {summaryData.preventiveCount}
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg">
                      <Badge className="bg-orange-500/20 text-orange-300 mb-2">
                        Corrective
                      </Badge>
                      <div className="text-2xl font-bold text-white">
                        {summaryData.correctiveCount}
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg">
                      <Badge className="bg-red-500/20 text-red-300 mb-2">
                        Emergency
                      </Badge>
                      <div className="text-2xl font-bold text-white">
                        {summaryData.emergencyCount}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {teamData && (
              <Card className="bg-slate-800 border-slate-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Team Performance
                  </h3>

                  <div className="space-y-3">
                    {teamData.teams?.map((team: any) => (
                      <div
                        key={team.id}
                        className="bg-slate-900 p-4 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-white">
                            {team.name}
                          </div>
                          <div className="text-sm text-slate-400">
                            {team.assignedCount} assigned • {team.completedCount}{" "}
                            completed
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-teal-400">
                            {team.completionRate}%
                          </div>
                          <div className="text-xs text-slate-400">completion</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {equipmentData && (
              <Card className="bg-slate-800 border-slate-700">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Equipment Health
                  </h3>

                  <div className="space-y-3">
                    {equipmentData.equipment?.map((item: any) => (
                      <div
                        key={item.id}
                        className="bg-slate-900 p-4 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-white">
                            {item.name}
                          </div>
                          <Badge
                            className={
                              item.healthStatus === "Excellent"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : item.healthStatus === "Good"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : item.healthStatus === "Fair"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-red-500/20 text-red-300"
                            }
                          >
                            {item.healthStatus}
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.healthScore >= 80
                                ? "bg-emerald-500"
                                : item.healthScore >= 60
                                  ? "bg-blue-500"
                                  : item.healthScore >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{
                              width: `${item.healthScore}%`,
                            }}
                          />
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Health Score: {item.healthScore}/100
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Export Cards */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Quick Export Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "This Month's Requests",
                description: "All maintenance requests from current month",
              },
              {
                title: "Overdue Items",
                description: "All overdue maintenance requests",
              },
              {
                title: "Team Performance",
                description: "Current month team metrics",
              },
              {
                title: "Equipment Status",
                description: "Current equipment health report",
              },
            ].map((template, i) => (
              <Card
                key={i}
                className="bg-slate-800 border-slate-700 hover:border-teal-400 cursor-pointer transition-colors"
              >
                <div className="p-4">
                  <h4 className="font-medium text-white">{template.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    {template.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-teal-400 hover:text-teal-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
