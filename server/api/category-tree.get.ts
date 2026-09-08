import { prisma } from "~~/server/utils/prisma";
import { voCopy } from "~~/server/utils/cmSsrUtil";
import { logger } from "~~/server/utils/logger";

type CategoryTreeRow = { categoryTreeId: string; img: string | null; parentTitle: string; value: string; children: string[]; smDesc: string | null };
const CATEGORY_TREE_COPY_KEYS: (keyof CategoryTreeRow)[] = ["parentTitle", "value", "children"];

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const rows = (await (prisma as any).categoryTree.findMany()) as CategoryTreeRow[];
  const categoryTree = rows.map((r) => ({
    ...voCopy(r, CATEGORY_TREE_COPY_KEYS),
    categoryId: r.categoryTreeId,
    img: r.img ?? undefined,
    smDesc: r.smDesc ?? undefined,
  }));

  const idToNameRows = await (prisma as any).categoryIdToName.findMany();
  const categoryIdToName: Record<string, string> = {};
  for (const r of idToNameRows as { categoryCode: string; displayName: string }[]) {
    categoryIdToName[r.categoryCode] = r.displayName;
  }

  const out = { categoryTree, categoryIdToName };
  const s = JSON.stringify(out);
  logger.info("[api] ◀", method, url, s.length > 200 ? s.slice(0, 200) + "..." : s);
  return out;
});
