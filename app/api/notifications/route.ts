import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/service/notification.service"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const limit = parseInt(searchParams.get("limit") || "20")

    if (action === "count") {
      const count = await getUnreadNotificationCount(session.userId)
      return NextResponse.json({ count })
    }

    const notifications = await getUserNotifications(session.userId, limit)
    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Notification GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get("id")
    const action = searchParams.get("action")

    if (action === "read") {
      if (!notificationId) {
        return NextResponse.json({ error: "Notification ID required" }, { status: 400 })
      }
      const notification = await markNotificationAsRead(notificationId)
      return NextResponse.json(notification)
    }

    if (action === "read-all") {
      await markAllNotificationsAsRead(session.userId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Notification PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get("id")

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 })
    }

    await deleteNotification(notificationId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notification DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
