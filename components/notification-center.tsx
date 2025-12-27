"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react"

interface Notification {
  id: string
  type: "OVERDUE" | "DUE_SOON" | "COMPLETED" | "ASSIGNED" | "STATUS_CHANGE"
  title: string
  message: string
  read: boolean
  readAt: string | null
  createdAt: string
  relatedRequestId?: string
}

const typeConfig = {
  OVERDUE: {
    icon: AlertTriangle,
    color: "bg-red-500/20 border-red-500/30 text-red-300",
    badge: "bg-red-500/20 text-red-300",
  },
  DUE_SOON: {
    icon: Clock,
    color: "bg-orange-500/20 border-orange-500/30 text-orange-300",
    badge: "bg-orange-500/20 text-orange-300",
  },
  COMPLETED: {
    icon: CheckCircle2,
    color: "bg-green-500/20 border-green-500/30 text-green-300",
    badge: "bg-green-500/20 text-green-300",
  },
  ASSIGNED: {
    icon: Calendar,
    color: "bg-blue-500/20 border-blue-500/30 text-blue-300",
    badge: "bg-blue-500/20 text-blue-300",
  },
  STATUS_CHANGE: {
    icon: AlertCircle,
    color: "bg-purple-500/20 border-purple-500/30 text-purple-300",
    badge: "bg-purple-500/20 text-purple-300",
  },
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  async function fetchNotifications() {
    try {
      setLoading(true)
      const response = await fetch("/api/notifications")
      const data = await response.json()
      setNotifications(data)

      const countRes = await fetch("/api/notifications?action=count")
      const countData = await countRes.json()
      setUnreadCount(countData.count)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(notificationId: string) {
    try {
      await fetch(`/api/notifications?id=${notificationId}&action=read`, {
        method: "PUT",
      })
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  async function markAllAsRead() {
    try {
      await fetch("/api/notifications?action=read-all", { method: "PUT" })
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
      })
      const deleted = notifications.find((n) => n.id === notificationId)
      if (deleted && !deleted.read) {
        setUnreadCount(Math.max(0, unreadCount - 1))
      }
      setNotifications(notifications.filter((n) => n.id !== notificationId))
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-slate-700/50 rounded-lg transition text-white"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-slate-800/95 backdrop-blur border border-slate-700/50 rounded-lg shadow-2xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white ml-2">{unreadCount}</Badge>
              )}
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {unreadCount > 0 && (
            <div className="px-4 py-2 border-b border-slate-700/50">
              <Button
                onClick={markAllAsRead}
                size="sm"
                variant="ghost"
                className="w-full text-xs text-teal-400 hover:text-teal-300"
              >
                Mark all as read
              </Button>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type]
                  const Icon = config.icon

                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-700/30 transition cursor-pointer ${
                        !notification.read ? "bg-slate-700/20" : ""
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-white font-medium text-sm">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="text-gray-500 hover:text-red-400 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-gray-600 text-xs">
                              {new Date(notification.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="border-t border-slate-700/50 p-4">
            <Button
              onClick={() => {
                setOpen(false)
                // TODO: Navigate to notifications page
              }}
              className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white text-sm"
            >
              View All Notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
