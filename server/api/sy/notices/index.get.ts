import { prisma } from "~~/server/utils/prisma";
import { logger } from "~~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);

  const query = getQuery(event);
  const pageNo = Math.max(1, Number(query.pageNo) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 10));
  const noticeTitle = String(query.noticeTitle ?? "").trim();
  const noticeType = String(query.noticeType ?? "");
  const status = String(query.status ?? "");

  const where: Record<string, unknown> = {};
  if (noticeTitle) where.noticeTitle = { contains: noticeTitle };
  if (noticeType) where.noticeType = noticeType;
  if (status !== "") where.status = status;

  const [list, total] = await Promise.all([
    (prisma as any).notice.findMany({
      where,
      orderBy: { noticeId: "desc" },
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
    }),
    (prisma as any).notice.count({ where }),
  ]);

  const rows = (list as any[]).map((r) => ({
    noticeId: String(r.noticeId),
    noticeTitle: r.noticeTitle,
    noticeType: r.noticeType,
    noticeContent: r.noticeContent,
    status: r.status,
    createBy: r.createBy,
    createTime: r.createTime ? new Date(r.createTime).toISOString().slice(0, 19).replace("T", " ") : null,
    updateBy: r.updateBy,
    updateTime: r.updateTime ? new Date(r.updateTime).toISOString().slice(0, 19).replace("T", " ") : null,
    remark: r.remark,
  }));

  logger.info("[api] ◀", method, url, "total=" + total);
  return { list: rows, totalCount: total };
});
