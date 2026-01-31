import { NextResponse } from "next/server"

export function GET() {
  const apiBase = process.env.NEXT_PUBLIC_CHAT_API_BASE ?? ""
  return NextResponse.json({ apiBase })
}
