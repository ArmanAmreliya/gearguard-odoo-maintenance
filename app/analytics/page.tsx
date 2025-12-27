"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react"

const maintenanceData = [
  { month: "Jan", preventive: 25, corrective: 15, emergency: 5 },
  { month: "Feb", preventive: 28, corrective: 18, emergency: 3 },
  { month: "Mar", preventive: 22, corrective: 12, emergency: 4 },
  { month: "Apr", preventive: 30, corrective: 20, emergency: 6 },
  { month: "May", preventive: 32, corrective: 16, emergency: 2 },
  { month: "Jun", preventive: 28, corrective: 14, emergency: 3 },
]

const costData = [
  { month: "Jan", preventive: 12000, corrective: 8500, emergency: 3200 },
  { month: "Feb", preventive: 13500, corrective: 9200, emergency: 2100 },
  { month: "Mar", preventive: 11200, corrective: 7500, emergency: 2800 },
  { month: "Apr", preventive: 14200, corrective: 10500, emergency: 4100 },
  { month: "May", preventive: 15800, corrective: 8900, emergency: 1500 },
  { month: "Jun", preventive: 13500, corrective: 7200, emergency: 1800 },
]

const healthData = [
  { name: "Excellent (90-100%)", value: 45, color: "#10b981" },
  { name: "Good (70-90%)", value: 35, color: "#3b82f6" },
  { name: "Fair (50-70%)", value: 15, color: "#f59e0b" },
  { name: "Poor (<50%)", value: 5, color: "#ef4444" },
]

const responseTimeData = [
  { day: "Mon", avgTime: 2.5 },
  { day: "Tue", avgTime: 2.2 },
  { day: "Wed", avgTime: 2.8 },
  { day: "Thu", avgTime: 2.1 },
  { day: "Fri", avgTime: 2.6 },
  { day: "Sat", avgTime: 3.2 },
  { day: "Sun", avgTime: 3.5 },
]

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-64 bg-slate-700/30" />
      ))}
    </div>
  )
}

function AnalyticsContent() {
  return (
    <div className="space-y-6">
      {/* Maintenance Volume Trend */}
      <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-400" />
            Maintenance Volume Trend
          </CardTitle>
          <CardDescription>Monthly maintenance requests by type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={maintenanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                textStyle={{ color: "#e2e8f0" }}
              />
              <Legend />
              <Bar dataKey="preventive" fill="#10b981" />
              <Bar dataKey="corrective" fill="#f59e0b" />
              <Bar dataKey="emergency" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Analysis */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              Cost Analysis
            </CardTitle>
            <CardDescription>Maintenance costs by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  textStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="preventive"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="corrective"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="emergency"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Equipment Health Distribution */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChartIcon className="w-6 h-6 text-purple-400" />
              Equipment Health Distribution
            </CardTitle>
            <CardDescription>Overall equipment condition</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  textStyle={{ color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Response Time Trend */}
      <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-white">Average Response Time by Day</CardTitle>
          <CardDescription>Hours to initial response</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                textStyle={{ color: "#e2e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="avgTime"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ fill: "#14b8a6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Maintenance Requests",
            value: "1,247",
            change: "+12%",
            positive: true,
          },
          {
            label: "Completion Rate",
            value: "94.3%",
            change: "+2.2%",
            positive: true,
          },
          {
            label: "Avg Response Time",
            value: "2.4 hrs",
            change: "-3.6%",
            positive: true,
          },
          {
            label: "Total Maintenance Cost",
            value: "$586.3K",
            change: "+8%",
            positive: false,
          },
        ].map((metric, idx) => (
          <Card key={idx} className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
            <CardContent className="pt-6">
              <p className="text-gray-400 text-sm mb-2">{metric.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <span
                  className={`text-sm font-semibold ${
                    metric.positive ? "text-green-400" : "text-orange-400"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Advanced Analytics</h1>
          <p className="text-gray-400">Real-time insights and performance metrics</p>
        </div>

        <Suspense fallback={<AnalyticsSkeleton />}>
          <AnalyticsContent />
        </Suspense>
      </div>
    </div>
  )
}
