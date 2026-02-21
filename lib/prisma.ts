import type { PrismaClient as PrismaClientType } from "@prisma/client"

const globalForPrisma = global as typeof globalThis & {
  prisma?: PrismaClientType
}

function getPrismaClient(): PrismaClientType {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  try {
    // Dynamic require to avoid crashing when @prisma/client is not generated
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client") as typeof import("@prisma/client")
    const client = new PrismaClient({ log: ["error", "warn"] })
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client
    }
    return client
  } catch {
    // Return a proxy that throws a helpful error on use
    return new Proxy({} as PrismaClientType, {
      get(_, prop) {
        if (prop === "then" || prop === Symbol.toPrimitive) return undefined
        throw new Error(
          `Prisma Client is not available. Run "npx prisma generate" or set AUTH_DISABLED=true. (accessed .${String(prop)})`
        )
      },
    })
  }
}

/** Lazy-loaded Prisma client – safe to import even when the generated client is missing. */
export const prisma: PrismaClientType = new Proxy({} as PrismaClientType, {
  get(_, prop) {
    return Reflect.get(getPrismaClient(), prop)
  },
})
