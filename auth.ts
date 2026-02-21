/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import type { NextAuthOptions } from "next-auth"
import Cognito from "next-auth/providers/cognito"

function getAdapter(): any {
  if (process.env.AUTH_DISABLED === "true") return undefined
  try {
    const { PrismaAdapter } = require("@auth/prisma-adapter")
    const { prisma } = require("@/lib/prisma")
    return PrismaAdapter(prisma)
  } catch {
    return undefined
  }
}

export const authOptions: NextAuthOptions = {
  adapter: getAdapter(),
  session: { strategy: "jwt" },
  providers: [
    Cognito({
      clientId: process.env.COGNITO_CLIENT_ID ?? "",
      clientSecret: process.env.COGNITO_CLIENT_SECRET ?? "",
      issuer: process.env.COGNITO_ISSUER ?? "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
}
