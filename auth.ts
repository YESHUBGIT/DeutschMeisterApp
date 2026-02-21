import type { NextAuthOptions } from "next-auth"
import Cognito from "next-auth/providers/cognito"

function getAdapter() {
  if (process.env.AUTH_DISABLED === "true") return undefined
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaAdapter } = require("@auth/prisma-adapter") as typeof import("@auth/prisma-adapter")
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { prisma } = require("@/lib/prisma") as { prisma: import("@prisma/client").PrismaClient }
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
