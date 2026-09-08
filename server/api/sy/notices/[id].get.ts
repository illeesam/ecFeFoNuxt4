import { prisma } from "~~/server/utils/prisma";
import { logger } from "~~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);

  const id = Number(getRouterParam(event, "id"));
  if (Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid notice id" });
  }

  const row = (await (prisma as any).notice.findUnique({ where: { noticeId: id } })) as any | null;
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: "공지를 찾을 수 없습니다." });
  }

  const out = {
    noticeId: String(row.noticeId),
    noticeTitle: row.noticeTitle,
    noticeType: row.noticeType,
    noticeContent: row.noticeContent ?? "",
    status: row.status,
    createBy: row.createBy,
    createTime: row.createTime ? new Date(row.createTime).toISOString().slice(0, 19).replace("T", " ") : null,
    updateBy: row.updateBy,
    updateTime: row.updateTime ? new Date(row.updateTime).toISOString().slice(0, 19).replace("T", " ") : null,
    remark: row.remark ?? "",
  };
  logger.info("[api] ◀", method, url);
  return out;
});
