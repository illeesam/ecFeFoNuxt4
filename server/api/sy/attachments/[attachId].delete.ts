import { prisma } from "~~/server/utils/prisma";
import { logger } from "~~/server/utils/logger";
import { join } from "path";
import { existsSync, unlinkSync } from "fs";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);

  const attachId = Number(getRouterParam(event, "attachId"));
  if (Number.isNaN(attachId)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid attach id" });
  }

  const row = (await (prisma as any).coAttach.findUnique({ where: { attachId } })) as any | null;
  if (!row || row.refType !== "notice") {
    throw createError({ statusCode: 404, statusMessage: "첨부파일을 찾을 수 없습니다." });
  }

  const publicDir = join(process.cwd(), "public");
  const localPath = row.url.startsWith("/") ? join(publicDir, row.url.slice(1)) : join(publicDir, row.url);
  if (existsSync(localPath)) {
    try {
      unlinkSync(localPath);
    } catch (_) {}
  }
  await (prisma as any).coAttach.delete({ where: { attachId } });

  logger.info("[api] ◀", method, url);
  return { ok: true };
});
