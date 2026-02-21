import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import { authOptions } from "@/auth"

const handler = NextAuth(authOptions)

function isMockSession(req: Request) {
  if (process.env.AUTH_DISABLED !== "true") return false
  const url = new URL(req.url)
  return url.pathname.endsWith("/session")
}

function mockSessionResponse() {
  return NextResponse.json({
    user: { name: "Local User", email: "local@deutschmeister.app" },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  })
}

export function GET(req: Request, ctx: never) {
  if (isMockSession(req)) return mockSessionResponse()
  return handler(req, ctx)
}

export function POST(req: Request, ctx: never) {
  if (isMockSession(req)) return mockSessionResponse()
  return handler(req, ctx)
}
