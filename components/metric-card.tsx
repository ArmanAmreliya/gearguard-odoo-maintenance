"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    percentage: number
    trend: "up" | "down"
  }
  icon?: LucideIcon | React.ReactNode
  color?: "green" | "blue" | "orange" | "red" | "purple"
}

const colorMap = {
  green: { icon: "text-green-400", change: "text-green-400" },
  blue: { icon: "text-blue-400", change: "text-blue-400" },
  orange: { icon: "text-orange-400", change: "text-orange-400" },
  red: { icon: "text-red-400", change: "text-red-400" },
  purple: { icon: "text-purple-400", change: "text-purple-400" },
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
}: MetricCardProps) {
  const colors = colorMap[color]
  const isPositive = change?.trend === "up"

  return (
    <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur hover:border-teal-500/50 transition">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
          {title}
          {Icon && typeof Icon === "function" ? (
            <Icon className={`w-5 h-5 ${colors.icon}`} />
          ) : (
            <div className={colors.icon}>{Icon}</div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        {change && (
          <p
            className={`text-xs mt-2 ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : "-"}
            {change.percentage}% {isPositive ? "increase" : "decrease"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
