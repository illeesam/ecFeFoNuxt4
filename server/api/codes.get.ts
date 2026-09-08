import { prisma } from "~~/server/utils/prisma";
import { voCopy } from "~~/server/utils/cmSsrUtil";
import { logger } from "~~/server/utils/logger";

type CodeRow = { codeId: number; grpCode: string; value: string; label: string };
const CODE_KEYS: (keyof CodeRow)[] = ["codeId", "grpCode", "value", "label"];

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const rows = (await (prisma as any).code.findMany({ orderBy: { codeId: "asc" } })) as CodeRow[];
  const out = rows.map((r) => voCopy(r, CODE_KEYS));
  logger.info("[api] ◀", method, url, "list size=" + out.length);
  return out;
});
