"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Save, AlertCircle } from "lucide-react"

interface NotificationPreferences {
  id: string
  userId: string
  emailOverdue: boolean
  emailDueSoon: boolean
  emailCompleted: boolean
  emailAssigned: boolean
  pushNotifications: boolean
  inAppNotifications: boolean
  notificationFrequency: string
  quietHoursStart: string | null
  quietHoursEnd: string | null
}

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchPreferences()
  }, [])

  async function fetchPreferences() {
    try {
      const response = await fetch("/api/notifications/preferences")
      const data = await response.json()
      setPreferences(data)
    } catch (error) {
      console.error("Failed to fetch preferences:", error)
      setMessage("Failed to load preferences")
    } finally {
      setLoading(false)
    }
  }

  async function savePreferences() {
    if (!preferences) return

    try {
      setSaving(true)
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOverdue: preferences.emailOverdue,
          emailDueSoon: preferences.emailDueSoon,
          emailCompleted: preferences.emailCompleted,
          emailAssigned: preferences.emailAssigned,
          pushNotifications: preferences.pushNotifications,
          inAppNotifications: preferences.inAppNotifications,
          notificationFrequency: preferences.notificationFrequency,
          quietHoursStart: preferences.quietHoursStart,
          quietHoursEnd: preferences.quietHoursEnd,
        }),
      })

      if (response.ok) {
        setMessage("Preferences saved successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      console.error("Failed to save preferences:", error)
      setMessage("Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-400">Failed to load preferences</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <Bell className="w-8 h-8 text-teal-400" />
            Notification Preferences
          </h1>
          <p className="text-gray-400">Manage your notification settings and alerts</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg border ${
              message.includes("success")
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Email Notifications */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Email Notifications</CardTitle>
            <CardDescription>Receive email alerts for maintenance events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "emailOverdue", label: "Overdue Maintenance", description: "When maintenance is overdue" },
              { key: "emailDueSoon", label: "Due Soon", description: "When maintenance is due within 2 days" },
              { key: "emailCompleted", label: "Completed", description: "When maintenance is completed" },
              { key: "emailAssigned", label: "Assigned to Me", description: "When a maintenance task is assigned to you" },
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/60 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={preferences[option.key as keyof NotificationPreferences] as boolean}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      [option.key]: e.target.checked,
                    })
                  }
                  className="mt-1 w-4 h-4 rounded accent-teal-500"
                />
                <div>
                  <p className="text-white font-medium">{option.label}</p>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* Push & In-App Notifications */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Other Notifications</CardTitle>
            <CardDescription>Additional notification channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/60 transition cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.inAppNotifications}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    inAppNotifications: e.target.checked,
                  })
                }
                className="mt-1 w-4 h-4 rounded accent-teal-500"
              />
              <div>
                <p className="text-white font-medium">In-App Notifications</p>
                <p className="text-sm text-gray-400">Show notifications in the app</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/60 transition cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    pushNotifications: e.target.checked,
                  })
                }
                className="mt-1 w-4 h-4 rounded accent-teal-500"
              />
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-sm text-gray-400">Send push notifications to your device</p>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Frequency & Quiet Hours */}
        <Card className="border border-slate-700/50 bg-slate-800/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Notification Frequency</CardTitle>
            <CardDescription>How often you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-white font-medium mb-2 block">Frequency</label>
              <div className="space-y-2">
                {[
                  { value: "IMMEDIATE", label: "Immediate" },
                  { value: "DAILY", label: "Daily Digest" },
                  { value: "WEEKLY", label: "Weekly Digest" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 p-2 rounded border border-slate-700/50 bg-slate-900/30 hover:bg-slate-900/60 transition cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={preferences.notificationFrequency === option.value}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          notificationFrequency: e.target.value,
                        })
                      }
                      className="w-4 h-4 accent-teal-500"
                    />
                    <span className="text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Quiet hours allow you to set a time range when notifications are suppressed</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white font-medium mb-2 block text-sm">Quiet Hours Start</label>
                <input
                  type="time"
                  value={preferences.quietHoursStart || ""}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      quietHoursStart: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-700/50 bg-slate-900/30 text-white"
                />
              </div>
              <div>
                <label className="text-white font-medium mb-2 block text-sm">Quiet Hours End</label>
                <input
                  type="time"
                  value={preferences.quietHoursEnd || ""}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      quietHoursEnd: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-700/50 bg-slate-900/30 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={savePreferences}
          disabled={saving}
          className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-semibold py-3"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}
