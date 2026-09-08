import { prisma } from "~~/server/utils/prisma";
import { voCopy } from "~~/server/utils/cmSsrUtil";
import { logger } from "~~/server/utils/logger";

type MenuRow = { menuTreeId: number; menuId: number; link: string; title: string; hasDropdown: boolean | null; megamenu: boolean | null; dropdownItems: unknown };
const MENU_KEYS: (keyof MenuRow)[] = ["menuTreeId", "menuId", "link", "title", "hasDropdown", "megamenu", "dropdownItems"];

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const rows = (await (prisma as any).menu.findMany({ orderBy: { menuTreeId: "asc" } })) as MenuRow[];
  const out = rows.map((r) => ({
    ...voCopy(r, MENU_KEYS),
    hasDropdown: r.hasDropdown ?? false,
    megamenu: r.megamenu ?? false,
    dropdownItems: r.dropdownItems as unknown[] | undefined,
  }));
  logger.info("[api] ◀", method, url, "list size=" + out.length);
  return out;
});
