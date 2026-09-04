import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  compgridPrisma?: PrismaClient
}

export function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return null
  }

  if (!globalForPrisma.compgridPrisma) {
    globalForPrisma.compgridPrisma = new PrismaClient()
  }

  return globalForPrisma.compgridPrisma
}
