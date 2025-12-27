import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import {
  getOrCreateNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/service/notification.service"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await getOrCreateNotificationPreferences(session.userId)
    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Preferences GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const preferences = await updateNotificationPreferences(session.userId, body)
    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Preferences PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
