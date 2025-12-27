import { PrismaClient } from "@prisma/client"
import { jwtVerify, SignJWT } from "jose"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

/* ------------------------------------------------------------------ */
/* Prisma Singleton */
/* ------------------------------------------------------------------ */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

/* ------------------------------------------------------------------ */
/* JWT Config */
/* ------------------------------------------------------------------ */

if (!process.env.AUTH_SECRET) {
  console.warn("⚠️ AUTH_SECRET not set, using insecure fallback")
}

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-key-change-in-production",
)

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type UserRole = "ADMIN" | "TECHNICIAN" | "USER"

export interface AuthSession {
  userId: string
  email: string
  name: string | null
  role: UserRole
  teamId: string | null
}

/* ------------------------------------------------------------------ */
/* Password Helpers */
/* ------------------------------------------------------------------ */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/* ------------------------------------------------------------------ */
/* JWT Helpers */
/* ------------------------------------------------------------------ */

export async function createToken(session: AuthSession): Promise<string> {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as AuthSession
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/* Session (Cookie-based) */
/* ------------------------------------------------------------------ */

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  return verifyToken(token)
}

export async function setSession(session: AuthSession): Promise<void> {
  const token = await createToken(session)
  const cookieStore = await cookies()

  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

/* ------------------------------------------------------------------ */
/* Auth Actions */
/* ------------------------------------------------------------------ */

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = "USER",
  teamId?: string | null,
) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error("User already exists")
  }

  const hashedPassword = await hashPassword(password)

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
      teamId: teamId ?? null,
    },
  })
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthSession> {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new Error("Invalid credentials")
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    throw new Error("Invalid credentials")
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    teamId: user.teamId,
  }
}

/* ------------------------------------------------------------------ */
/* API Response Helpers */
/* ------------------------------------------------------------------ */

export function successResponse(data: any, status: number = 200, headers?: Record<string, string>) {
  return NextResponse.json(data, { 
    status,
    headers: headers || {}
  })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/* ------------------------------------------------------------------ */
/* Workflow Helpers */
/* ------------------------------------------------------------------ */

export function validateStatusTransition(
  currentStatus: string,
  newStatus: string,
) {
  const validTransitions: Record<string, string[]> = {
    NEW: ["IN_PROGRESS", "SCRAP"],
    IN_PROGRESS: ["REPAIRED", "SCRAP"],
    REPAIRED: [],
    SCRAP: [],
  }

  const allowed = validTransitions[currentStatus] || []

  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Invalid status transition from ${currentStatus} to ${newStatus}`,
    )
  }
}

export async function handleScrapLogic(
  equipmentId: string,
  tx: PrismaClient,
) {
  await tx.equipment.update({
    where: { id: equipmentId },
    data: { isScrapped: true },
  })
}
