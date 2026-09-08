import { prisma } from "~~/server/utils/prisma";
import { voCopy } from "~~/server/utils/cmSsrUtil";
import { logger } from "~~/server/utils/logger";

type BrandRow = { brandId: number; brandCode: string; brandName: string };
const BRAND_KEYS: (keyof BrandRow)[] = ["brandId", "brandCode", "brandName"];

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const rows = await (prisma as any).brand.findMany({ orderBy: { brandId: "asc" } }) as BrandRow[];
  const out = rows.map((r) => voCopy(r, BRAND_KEYS));
  logger.info("[api] ◀", method, url, "list size=" + out.length);
  return out;
});
