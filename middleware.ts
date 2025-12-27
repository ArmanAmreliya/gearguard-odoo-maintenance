import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-key-change-in-production"
)

type UserRole = "ADMIN" | "TECHNICIAN" | "USER"

interface AuthPayload {
  userId: string
  email: string
  name: string | null
  role: UserRole
  teamId: string | null
}

/* ===================================================================
   ROLE-BASED ROUTE ACCESS MATRIX
   =================================================================== */

const roleRouteAccess: Record<UserRole, string[]> = {
  ADMIN: [
    "/dashboard",
    "/equipment",
    "/equipment/[id]",
    "/teams",
    "/requests/kanban",
    "/requests/calendar",
    "/admin",
    "/admin/users",
  ],
  TECHNICIAN: [
    "/dashboard",
    "/requests/kanban",
    "/requests/calendar",
    "/equipment/[id]",
  ],
  USER: [
    "/dashboard",
    "/requests/new",
    "/requests",
    "/equipment/[id]",
  ],
}

const publicRoutes = ["/login", "/", "/api/auth/login", "/api/auth/logout", "/api/auth/session"]

/* ===================================================================
   HELPER FUNCTIONS
   =================================================================== */

async function verifyAuth(
  request: NextRequest
): Promise<AuthPayload | null> {
  const token = request.cookies.get("auth-token")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as AuthPayload
  } catch {
    return null
  }
}

function matchRoute(requestPath: string, allowedRoute: string): boolean {
  // Convert /equipment/[id] to regex pattern: /equipment/[^/]+
  const regexPattern = allowedRoute
    .replace(/\//g, '\\/') // Escape forward slashes
    .replace(/\[.*?\]/g, '[^/]+') // Replace [id] with [^/]+

  const regex = new RegExp(`^${regexPattern}/?$`)
  return regex.test(requestPath)
}

function hasAccessToRoute(
  userRole: UserRole,
  requestPath: string
): boolean {
  const allowedRoutes = roleRouteAccess[userRole]

  return allowedRoutes.some((route) => matchRoute(requestPath, route))
}

function getCleanPath(pathname: string): string {
  // Remove query parameters and hash
  return pathname.split("?")[0].split("#")[0]
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api")
}

/* ===================================================================
   MIDDLEWARE LOGIC
   =================================================================== */

export async function middleware(request: NextRequest) {
  const pathname = getCleanPath(request.nextUrl.pathname)

  // Allow public routes without auth
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Verify authentication
  const session = await verifyAuth(request)

  // ❌ UNAUTHENTICATED USER
  if (!session) {
    if (isApiRoute(pathname)) {
      // API: Return 401 Unauthorized
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    } else {
      // Pages: Redirect to login
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ✅ AUTHENTICATED - Check role-based access
  const hasAccess = hasAccessToRoute(session.role, pathname)

  if (!hasAccess) {
    if (isApiRoute(pathname)) {
      // API: Return 403 Forbidden
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      )
    } else {
      // Pages: Redirect to dashboard or show 403
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // ✅ AUTHORIZED - Allow request to proceed
  return NextResponse.next()
}

/* ===================================================================
   MATCHER CONFIG
   =================================================================== */

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
