import { PrismaClient } from "@prisma/client";

// Prisma reads DATABASE_URL from the server environment at query time.
// In production, set DATABASE_URL in Vercel Project Settings before enabling
// live request submission, dashboard data, or customer tracking.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
