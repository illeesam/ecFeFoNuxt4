import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import { logger } from "~~/server/utils/logger";
import { formatSql } from "~~/server/utils/sqlFormat";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV !== "production"
        ? [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "error" },
            { emit: "stdout", level: "warn" },
          ]
        : [
            { emit: "stdout", level: "error" },
            { emit: "stdout", level: "warn" },
          ],
  });
  if (process.env.NODE_ENV !== "production") {
    (client as any).$on("query", (e: { query: string; params: string; duration: number }) => {
      const formatted = formatSql(e.query);
      logger.info("[Prisma query]", e.duration + "ms", e.params);
      logger.info(formatted);
    });
  }
  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
