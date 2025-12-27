import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-key-change-in-production"
)

export async function GET(req: Request) {
  try {
    // Get auth token from cookies
    let authToken = req.headers
      .get("cookie")
      ?.split("auth-token=")[1]
      ?.split(";")[0]

    if (!authToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Decode URL-encoded token if necessary
    try {
      authToken = decodeURIComponent(authToken)
    } catch {
      // Token might not be URL-encoded, continue as-is
    }

    // Verify JWT token
    const { payload } = await jwtVerify(authToken, JWT_SECRET)

    return NextResponse.json({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      teamId: payload.teamId || null,
    })
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json(
      { error: "Invalid session" },
      { status: 401 }
    )
  }
}
