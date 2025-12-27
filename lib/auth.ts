import { prisma } from "./db"
import bcrypt from "bcrypt"
import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "dev-secret-key-change-in-production")

export interface AuthSession {
  userId: string
  email: string
  name: string
  role: "ADMIN" | "TECHNICIAN" | "USER"
  teamId: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(session: AuthSession): Promise<string> {
  return new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret)
}

export async function verifyToken(token: string): Promise<AuthSession | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as AuthSession
  } catch {
    return null
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  return verifyToken(token)
}

export async function setSession(session: AuthSession, response: any): Promise<string> {
  const token = await createToken(session)
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
  })
  return token
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: "ADMIN" | "TECHNICIAN" | "USER" = "USER",
  teamId?: string,
) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error("User already exists")
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
      teamId,
    },
  })

  return user
}

export async function authenticateUser(email: string, password: string): Promise<AuthSession> {
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
    role: user.role as "ADMIN" | "TECHNICIAN" | "USER",
    teamId: user.teamId,
  }
}
