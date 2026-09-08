import { prisma } from "~~/server/utils/prisma";
import { voCopy } from "~~/server/utils/cmSsrUtil";
import { logger } from "~~/server/utils/logger";

type BlogRow = { blogId: number; img: string; title: string; author: string; date: string; desc: string; blog: string };
const BLOG_KEYS: (keyof BlogRow)[] = ["blogId", "img", "title", "author", "date", "desc", "blog"];

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const rows = (await (prisma as any).blog.findMany({ orderBy: { blogId: "asc" } })) as BlogRow[];
  const out = rows.map((r) => voCopy(r, BLOG_KEYS));
  logger.info("[api] ◀", method, url, "list size=" + out.length);
  return out;
});
