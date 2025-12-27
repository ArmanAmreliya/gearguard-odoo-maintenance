"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Bell,
  Download,
  FileText,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Settings,
} from "lucide-react"

export default function PrototypePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Missing Features Prototype</h1>
          <p className="text-gray-400">Quick static prototypes for recommended enhancements</p>
        </div>

        {/* 1. Advanced Analytics Dashboard */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-teal-400" />
              Advanced Analytics Dashboard
            </CardTitle>
            <CardDescription>Real-time data visualization and insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Chart 1: Maintenance Trends */}
              <div className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/30">
                <h3 className="text-white font-semibold mb-4">Maintenance Trends (6 Months)</h3>
                <div className="h-48 bg-gradient-to-br from-teal-500/20 to-green-500/20 rounded-lg flex flex-col items-end justify-end p-4 space-y-2">
                  {[65, 78, 72, 85, 92, 88].map((height, idx) => (
                    <div key={idx} className="flex gap-2 w-full items-end">
                      <div
                        className="bg-gradient-to-t from-teal-500 to-green-500 rounded-t flex-1"
                        style={{ height: `${(height / 100) * 40}px` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">📊 Average: 80 maintenance requests/month</p>
              </div>

              {/* Chart 2: Equipment Health Distribution */}
              <div className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/30">
                <h3 className="text-white font-semibold mb-4">Equipment Health</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Excellent (90-100%)</span>
                      <span className="text-green-400">45%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Good (70-90%)</span>
                      <span className="text-blue-400">35%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Fair (50-70%)</span>
                      <span className="text-orange-400">15%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Poor (&lt;50%)</span>
                      <span className="text-red-400">5%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 3: Cost Analysis */}
              <div className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/30">
                <h3 className="text-white font-semibold mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-gray-400 text-sm">Preventive</span>
                    </div>
                    <span className="text-blue-400 font-semibold">$45,230</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-gray-400 text-sm">Corrective</span>
                    </div>
                    <span className="text-orange-400 font-semibold">$38,450</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-gray-400 text-sm">Emergency</span>
                    </div>
                    <span className="text-red-400 font-semibold">$12,800</span>
                  </div>
                  <div className="border-t border-slate-700/50 pt-3 mt-3 flex items-center justify-between">
                    <span className="text-gray-300 font-semibold">Total</span>
                    <span className="text-teal-400 font-bold text-lg">$96,480</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Notification Center */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-orange-400" />
              Notification & Alert System
            </CardTitle>
            <CardDescription>Real-time notifications for maintenance events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  type: "Overdue",
                  title: "Maintenance overdue",
                  message: "Equipment EQ-0045 (Pump) is 3 days overdue for maintenance",
                  time: "5 minutes ago",
                  icon: AlertTriangle,
                  color: "text-red-400",
                },
                {
                  type: "Scheduled",
                  title: "Scheduled maintenance today",
                  message: "Compressor (EQ-0032) maintenance scheduled at 2:00 PM",
                  time: "1 hour ago",
                  icon: Calendar,
                  color: "text-blue-400",
                },
                {
                  type: "Completed",
                  title: "Maintenance completed",
                  message: "Motor replacement for EQ-0018 completed by John Smith",
                  time: "3 hours ago",
                  icon: CheckCircle2,
                  color: "text-green-400",
                },
                {
                  type: "Due Soon",
                  title: "Maintenance due soon",
                  message: "Equipment EQ-0055 maintenance is due in 2 days",
                  time: "1 day ago",
                  icon: Clock,
                  color: "text-orange-400",
                },
              ].map((notif, idx) => {
                const Icon = notif.icon
                return (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-lg border border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/60 transition"
                  >
                    <Icon className={`w-5 h-5 mt-1 shrink-0 ${notif.color}`} />
                    <div className="flex-1">
                      <p className="text-white font-medium">{notif.title}</p>
                      <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                    </div>
                    <Badge className="h-fit bg-slate-700">{notif.type}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 3. Report & Export System */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="w-6 h-6 text-green-400" />
              Reports & Export Features
            </CardTitle>
            <CardDescription>Generate and export reports in multiple formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Monthly Maintenance Report",
                  description: "Complete summary of all maintenance activities",
                  formats: ["PDF", "Excel", "CSV"],
                  icon: FileText,
                },
                {
                  title: "Equipment Health Report",
                  description: "Equipment condition and risk assessment",
                  formats: ["PDF", "Excel"],
                  icon: TrendingUp,
                },
                {
                  title: "Cost Analysis Report",
                  description: "Maintenance costs breakdown and trends",
                  formats: ["PDF", "Excel", "CSV"],
                  icon: BarChart3,
                },
                {
                  title: "Team Performance Report",
                  description: "Team productivity and efficiency metrics",
                  formats: ["PDF", "Excel"],
                  icon: TrendingUp,
                },
              ].map((report, idx) => {
                const Icon = report.icon
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/60 transition"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Icon className="w-5 h-5 text-teal-400 mt-0.5" />
                      <div>
                        <h4 className="text-white font-semibold">{report.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{report.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {report.formats.map((format) => (
                        <Button
                          key={format}
                          size="sm"
                          className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white text-xs"
                        >
                          {format}
                        </Button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 4. Advanced Settings */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-400" />
              System Settings & Configuration
            </CardTitle>
            <CardDescription>Advanced system configuration options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Notification Preferences",
                  options: ["Email alerts", "SMS notifications", "In-app alerts", "Scheduled digests"],
                },
                {
                  title: "Maintenance Rules",
                  options: ["Auto-schedule preventive", "Risk thresholds", "Cost limits", "SLA settings"],
                },
                {
                  title: "Integration Settings",
                  options: ["Slack integration", "Microsoft Teams", "Email servers", "API webhooks"],
                },
                {
                  title: "Data Management",
                  options: ["Backup schedule", "Data retention", "Archive old records", "Export settings"],
                },
              ].map((section, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-slate-700/50 bg-slate-900/30">
                  <h4 className="text-white font-semibold mb-3">{section.title}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {section.options.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className="flex items-center gap-2 p-2 rounded bg-slate-800/50 hover:bg-slate-800 transition cursor-pointer"
                      >
                        <div className="w-4 h-4 rounded border border-teal-500 bg-teal-500/20"></div>
                        <span className="text-sm text-gray-300">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Implementation Status */}
        <Card className="border border-teal-500/50 bg-gradient-to-r from-teal-500/10 to-green-500/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Implementation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Advanced Analytics</span>
                  <Badge className="bg-blue-500">In Development</Badge>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "60%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Notification System</span>
                  <Badge className="bg-blue-500">In Development</Badge>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "40%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Reports & Export</span>
                  <Badge className="bg-orange-500">Planned</Badge>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: "20%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Advanced Settings</span>
                  <Badge className="bg-orange-500">Planned</Badge>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
