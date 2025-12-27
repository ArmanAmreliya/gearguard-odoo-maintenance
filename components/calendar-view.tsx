"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MaintenanceRequest {
  id: string
  subject: string
  scheduledDate: string | null
  requestType: string
  status: string
  equipment: { name: string }
}

interface CalendarViewProps {
  requests: MaintenanceRequest[]
  onDateClick?: (date: Date) => void
}

export function CalendarView({ requests, onDateClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const preventiveRequests = requests.filter((r) => r.requestType === "PREVENTIVE" && r.scheduledDate)

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const getRequestsForDate = (date: Date) => {
    return preventiveRequests.filter((r) => {
      const reqDate = new Date(r.scheduledDate!)
      return (
        reqDate.getFullYear() === date.getFullYear() &&
        reqDate.getMonth() === date.getMonth() &&
        reqDate.getDate() === date.getDate()
      )
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days: (number | null)[] = Array(firstDay).fill(null)

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Preventive Maintenance Schedule</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="w-32 text-center font-medium">{monthName}</span>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-semibold text-sm p-2">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const date = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null
            const dayRequests = date ? getRequestsForDate(date) : []

            return (
              <div
                key={index}
                className={`min-h-24 p-2 border rounded-lg ${day ? "bg-card cursor-pointer hover:bg-muted" : "bg-background"}`}
                onClick={() => day && date && onDateClick?.(date)}
              >
                {day && (
                  <>
                    <div className="text-sm font-medium mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayRequests.map((req) => (
                        <Badge key={req.id} variant="secondary" className="text-xs w-full truncate">
                          {req.equipment.name}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
