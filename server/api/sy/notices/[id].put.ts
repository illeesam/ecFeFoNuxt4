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

  const body = await readBody<{
    noticeTitle: string;
    noticeType: string;
    noticeContent?: string;
    status: string;
    remark?: string;
  }>(event);

  if (!body?.noticeTitle?.trim()) {
    throw createError({ statusCode: 400, statusMessage: "공지제목을 입력하세요." });
  }

  await (prisma as any).notice.update({
    where: { noticeId: id },
    data: {
      noticeTitle: body.noticeTitle.trim(),
      noticeType: body.noticeType || "1",
      noticeContent: body.noticeContent?.trim() ?? null,
      status: body.status ?? "0",
      remark: body.remark?.trim() ?? null,
      updateBy: "admin",
      updateTime: new Date(),
    },
  });

  logger.info("[api] ◀", method, url);
  return { ok: true };
});
