import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    apiUrl: process.env.NEXT_PUBLIC_TUTOR_API_URL ?? "",
  })
}
