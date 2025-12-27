import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const session = await authenticateUser(email, password)

    const cookieStore = await cookies()
    const token = await import("@/lib/auth").then((m) => m.createToken(session))

    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })

    return NextResponse.json({ success: true, session })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 401 })
  }
}
