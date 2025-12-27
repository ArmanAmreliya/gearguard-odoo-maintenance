import { NextResponse } from "next/server"
import { SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-key-change-in-production"
)

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Temporary demo credentials - REMOVE IN PRODUCTION
    const demoUsers: Record<string, { name: string; role: string; id: string; teamId?: string }> = {
      "admin@gearguard.com": { name: "Alex Johnson", role: "ADMIN", id: "1", teamId: "admin-team" },
      "tech@gearguard.com": { name: "Sarah Williams", role: "TECHNICIAN", id: "2", teamId: "tech-team-1" },
      "user@gearguard.com": { name: "David Martinez", role: "USER", id: "3", teamId: "team-1" },
    }

    const user = demoUsers[email.toLowerCase()]

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Demo mode: Accept any password
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      )
    }

    // Create JWT token
    const token = await new SignJWT({
      userId: user.id,
      email: email.toLowerCase(),
      name: user.name,
      role: user.role,
      teamId: user.teamId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: email.toLowerCase(),
          name: user.name,
          role: user.role,
          teamId: user.teamId,
        },
      },
      { status: 200 }
    )

    // Set session cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    )
  }
}
