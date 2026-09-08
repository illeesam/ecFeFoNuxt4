import { prisma } from "~~/server/utils/prisma";
import { logger } from "~~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);

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

  const row = await (prisma as any).notice.create({
    data: {
      noticeTitle: body.noticeTitle.trim(),
      noticeType: body.noticeType || "1",
      noticeContent: body.noticeContent?.trim() ?? null,
      status: body.status ?? "0",
      remark: body.remark?.trim() ?? null,
      createBy: "admin",
      createTime: new Date(),
    },
  });

  const out = { noticeId: String(row.noticeId) };
  logger.info("[api] ◀", method, url, out);
  return out;
});
