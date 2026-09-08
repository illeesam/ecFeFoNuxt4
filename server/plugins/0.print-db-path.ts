import { logger } from "~~/server/utils/logger";

export default defineNitroPlugin(() => {
  const url = process.env.DATABASE_URL;
  if (!url?.startsWith("postgresql://")) return;
  try {
    const u = new URL(url);
    const db = u.pathname?.slice(1)?.split("?")[0] || "";
    const schema = u.searchParams.get("schema") || "public";
    logger.info("[Prisma] PostgreSQL:", `${u.hostname}:${u.port}/${db}`, "schema:", schema);
  } catch {
    logger.info("[Prisma] PostgreSQL (DATABASE_URL 설정됨)");
  }
});
