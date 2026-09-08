import { prisma } from "~~/server/utils/prisma";
import { voCopy } from "~~/server/utils/cmSsrUtil";
import { logger } from "~~/server/utils/logger";

type BlogRow = { blogId: number; img: string; title: string; author: string; date: string; desc: string; blog: string };
const BLOG_KEYS: (keyof BlogRow)[] = ["blogId", "img", "title", "author", "date", "desc", "blog"];

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const id = Number(getRouterParam(event, "id"));
  const row = (await (prisma as any).blog.findUnique({ where: { blogId: id } })) as BlogRow | null;
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: "블로그를 찾을 수 없습니다." });
  }
  const out = voCopy(row, BLOG_KEYS);
  const s = JSON.stringify(out);
  logger.info("[api] ◀", method, url, s.length > 200 ? s.slice(0, 200) + "..." : s);
  return out;
});
