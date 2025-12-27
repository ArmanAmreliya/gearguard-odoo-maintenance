import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("auth-token")
  return response
}
