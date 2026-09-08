import { prisma } from "~~/server/utils/prisma";
import { voCopy } from "~~/server/utils/cmSsrUtil";
import { logger } from "~~/server/utils/logger";

type OptionRow = { optionId: number; optionCode: string; optionName: string; optionType: string; optionLevel: number };
const OPTION_KEYS: (keyof OptionRow)[] = ["optionId", "optionCode", "optionName", "optionType", "optionLevel"];

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const rows = (await (prisma as any).option.findMany({ orderBy: { optionId: "asc" } })) as OptionRow[];
  const out = rows.map((r) => voCopy(r, OPTION_KEYS));
  logger.info("[api] ◀", method, url, "list size=" + out.length);
  return out;
});
