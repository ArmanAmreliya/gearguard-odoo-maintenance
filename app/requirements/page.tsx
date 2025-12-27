"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Clock, Zap } from "lucide-react"

const requirements = [
  {
    category: "Core Features",
    items: [
      { name: "Equipment Management", status: "✅", description: "Full CRUD, health tracking, maintenance history" },
      { name: "Maintenance Requests", status: "✅", description: "CRUD, status tracking, priority levels" },
      { name: "Team Management", status: "✅", description: "Team creation, assignment, role-based access" },
      { name: "Dashboard Analytics", status: "✅", description: "Insights, metrics, risk assessment" },
      { name: "Request Workflows", status: "✅", description: "Kanban board, status transitions" },
      { name: "Notification System", status: "🔄", description: "Email alerts, status updates" },
    ],
  },
  {
    category: "UI/UX",
    items: [
      { name: "Landing Page", status: "✅", description: "Modern hero section, features, CTAs" },
      { name: "Login Page", status: "✅", description: "Enhanced styling, demo accounts" },
      { name: "Dashboard Portal", status: "✅", description: "Role-based layout, sidebar navigation" },
      { name: "Responsive Design", status: "✅", description: "Mobile, tablet, desktop optimization" },
      { name: "Dark Mode", status: "✅", description: "Default dark theme with gradients" },
      { name: "Data Visualization", status: "🔄", description: "Charts, graphs, analytics" },
    ],
  },
  {
    category: "Security & Access Control",
    items: [
      { name: "Authentication", status: "✅", description: "Session-based, role validation" },
      { name: "Authorization", status: "✅", description: "Role-based (ADMIN, TECHNICIAN, USER)" },
      { name: "Data Protection", status: "✅", description: "Encrypted passwords, session tokens" },
      { name: "API Security", status: "✅", description: "Protected routes, validation" },
      { name: "Audit Logging", status: "🔄", description: "User action tracking" },
      { name: "Two-Factor Auth", status: "⏳", description: "Optional enhancement" },
    ],
  },
  {
    category: "Data Management",
    items: [
      { name: "Database Schema", status: "✅", description: "Prisma ORM, normalized structure" },
      { name: "Data Validation", status: "✅", description: "Server-side validation" },
      { name: "Export Functionality", status: "🔄", description: "PDF, CSV export" },
      { name: "Data Backup", status: "⏳", description: "Automated backups" },
      { name: "Reporting", status: "✅", description: "Request reports, analytics" },
      { name: "Search & Filter", status: "✅", description: "Equipment, request filters" },
    ],
  },
  {
    category: "Performance & Scalability",
    items: [
      { name: "Database Caching", status: "✅", description: "Query optimization, Prisma caching" },
      { name: "API Pagination", status: "✅", description: "Large dataset handling" },
      { name: "Image Optimization", status: "✅", description: "SVG icons, optimized assets" },
      { name: "Load Testing", status: "🔄", description: "Performance monitoring" },
      { name: "CDN Integration", status: "⏳", description: "Static asset delivery" },
      { name: "Database Indexing", status: "✅", description: "Query performance" },
    ],
  },
  {
    category: "Mobile Support",
    items: [
      { name: "Responsive Layout", status: "✅", description: "Works on all screen sizes" },
      { name: "Touch Optimization", status: "🔄", description: "Mobile-friendly interactions" },
      { name: "Progressive Web App", status: "⏳", description: "Offline support, installable" },
      { name: "Native Mobile App", status: "⏳", description: "iOS/Android versions" },
      { name: "Push Notifications", status: "🔄", description: "Mobile alerts" },
    ],
  },
]

const statusConfig = {
  "✅": { color: "bg-green-500", label: "Implemented", icon: CheckCircle2 },
  "🔄": { color: "bg-blue-500", label: "In Progress", icon: Clock },
  "⏳": { color: "bg-orange-500", label: "Planned", icon: Clock },
  "❌": { color: "bg-red-500", label: "Not Started", icon: AlertCircle },
}

export default function RequirementsPage() {
  const implementedCount = requirements.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.status === "✅").length,
    0
  )
  const totalCount = requirements.reduce((acc, cat) => acc + cat.items.length, 0)
  const completionPercentage = Math.round((implementedCount / totalCount) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">MaintenX Requirements Checklist</h1>
          <p className="text-gray-400">Comprehensive feature & requirement validation</p>
        </div>

        {/* Progress */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{completionPercentage}%</p>
                <p className="text-gray-400">
                  {implementedCount} of {totalCount} features implemented
                </p>
              </div>
              <div className="w-32 h-32 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-green-500 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{completionPercentage}%</span>
                </div>
              </div>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-green-500 transition-all"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requirements.map((category, idx) => (
            <Card key={idx} className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">{category.category}</CardTitle>
                <CardDescription>
                  {category.items.filter((i) => i.status === "✅").length} of {category.items.length} complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-start gap-3 p-3 rounded-lg border border-slate-700/30 bg-slate-900/30 hover:bg-slate-900/60 transition"
                    >
                      <div className="mt-1">
                        {item.status === "✅" && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                        {item.status === "🔄" && <Clock className="w-5 h-5 text-blue-400" />}
                        {item.status === "⏳" && <Clock className="w-5 h-5 text-orange-400" />}
                        {item.status === "❌" && <AlertCircle className="w-5 h-5 text-red-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Status Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Implemented</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-300">Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-300">Not Started</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border border-teal-500/50 bg-gradient-to-r from-teal-500/10 to-green-500/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Recommended Next Steps</CardTitle>
            <CardDescription>Priority items to enhance the system</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-teal-400 font-bold">1.</span>
                <span>Implement notification system with email alerts for maintenance due dates</span>
              </li>
              <li className="flex gap-3">
                <span className="text-teal-400 font-bold">2.</span>
                <span>Add advanced data visualization with charts and real-time analytics</span>
              </li>
              <li className="flex gap-3">
                <span className="text-teal-400 font-bold">3.</span>
                <span>Enable CSV/PDF export for reports and data backup</span>
              </li>
              <li className="flex gap-3">
                <span className="text-teal-400 font-bold">4.</span>
                <span>Implement audit logging for compliance and tracking</span>
              </li>
              <li className="flex gap-3">
                <span className="text-teal-400 font-bold">5.</span>
                <span>Add mobile app version for field technicians</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
