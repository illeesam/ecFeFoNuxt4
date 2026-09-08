import { prisma } from "~~/server/utils/prisma";
import { logger } from "~~/server/utils/logger";

const REF_TYPE = "notice";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);

  const id = Number(getRouterParam(event, "id"));
  if (Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid notice id" });
  }

  const rows = await (prisma as any).coAttach.findMany({
    where: { refType: REF_TYPE, refId: id },
    orderBy: [{ sortOrder: "asc" }, { attachId: "asc" }],
  });

  const list = (rows as any[]).map((r) => ({
    attachId: r.attachId,
    fileNm: r.fileNm ?? r.physicalNm,
    physicalNm: r.physicalNm,
    ext: r.ext,
    fileSize: r.fileSize,
    mimeType: r.mimeType,
    url: r.url,
    sortOrder: r.sortOrder,
  }));
  logger.info("[api] ◀", method, url, "count=" + list.length);
  return { list };
});
