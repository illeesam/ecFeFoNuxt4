import { prisma } from "~~/server/utils/prisma";
import { voCopy } from "~~/server/utils/cmSsrUtil";
import { logger } from "~~/server/utils/logger";

type CategoryRow = { categoryId: number; categoryCode: string; categoryName: string; categoryLevel: number; parentCategory: string | null };
const CATEGORY_KEYS: (keyof CategoryRow)[] = ["categoryId", "categoryCode", "categoryName", "categoryLevel", "parentCategory"];

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const rows = (await (prisma as any).category.findMany({ orderBy: { categoryId: "asc" } })) as CategoryRow[];
  const out = rows.map((r) => voCopy(r, CATEGORY_KEYS));
  logger.info("[api] ◀", method, url, "list size=" + out.length);
  return out;
});
