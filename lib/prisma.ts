/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Lazy-loaded Prisma client.
 *
 * We purposely avoid ANY static import (including `import type`) from
 * `@prisma/client` because Turbopack resolves even type-only imports at
 * bundle time and crashes when the generated client is missing.
 *
 * Instead we dynamically require the package at runtime and fall back to a
 * helpful error proxy when it isn't available (e.g. AUTH_DISABLED=true).
 */

const globalForPrisma = globalThis as typeof globalThis & { __prisma?: any }

function getPrismaClient(): any {
  if (globalForPrisma.__prisma) return globalForPrisma.__prisma

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@prisma/client")
    const client = new mod.PrismaClient({ log: ["error", "warn"] })
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.__prisma = client
    }
    return client
  } catch {
    // Return a proxy that throws a helpful error when any property is accessed
    return new Proxy(
      {},
      {
        get(_, prop) {
          if (prop === "then" || prop === Symbol.toPrimitive) return undefined
          throw new Error(
            `Prisma Client is not available. Run "npx prisma generate" or set AUTH_DISABLED=true. (accessed .${String(prop)})`
          )
        },
      }
    )
  }
}

/** Lazy Prisma client – safe to import even without a generated client. */
export const prisma: any = new Proxy(
  {},
  {
    get(_, prop) {
      return Reflect.get(getPrismaClient(), prop)
    },
  }
)
