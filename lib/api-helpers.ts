import { getSession } from "@/lib/auth"
import type { AuthSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function withAuth(handler: (session: AuthSession) => Promise<Response>) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return handler(session)
}

export function withRole(allowedRoles: string[]) {
  return async (handler: (session: AuthSession) => Promise<Response>) => {
    const session = await getSession()
    if (!session || !allowedRoles.includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return handler(session)
  }
}

export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}
