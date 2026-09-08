import { prisma } from "~~/server/utils/prisma";
import { logger } from "~~/server/utils/logger";
import { join } from "path";
import { existsSync, unlinkSync } from "fs";

const REF_TYPE = "notice";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);

  const id = Number(getRouterParam(event, "id"));
  if (Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid notice id" });
  }

  const attaches = await (prisma as any).coAttach.findMany({
    where: { refType: REF_TYPE, refId: id },
  });
  const publicDir = join(process.cwd(), "public");
  for (const a of attaches as any[]) {
    const localPath = a.url.startsWith("/") ? join(publicDir, a.url.slice(1)) : join(publicDir, a.url);
    if (existsSync(localPath)) {
      try {
        unlinkSync(localPath);
      } catch (_) {}
    }
  }
  await (prisma as any).coAttach.deleteMany({ where: { refType: REF_TYPE, refId: id } });
  await (prisma as any).notice.delete({ where: { noticeId: id } });

  logger.info("[api] ◀", method, url);
  return { ok: true };
});
