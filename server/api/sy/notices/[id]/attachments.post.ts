import { prisma } from "~~/server/utils/prisma";
import { logger } from "~~/server/utils/logger";
import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";

const REF_TYPE = "notice";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXT = new Set([
  "jpg", "jpeg", "png", "gif", "webp", "bmp", "svg",
  "mp4", "webm", "avi", "mov", "mkv",
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "hwp", "txt", "csv",
  "zip", "rar", "7z",
]);

function getExt(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);

  const id = Number(getRouterParam(event, "id"));
  if (Number.isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid notice id" });
  }

  const notice = await (prisma as any).notice.findUnique({ where: { noticeId: id } });
  if (!notice) {
    throw createError({ statusCode: 404, statusMessage: "공지를 찾을 수 없습니다." });
  }

  const parts = await readMultipartFormData(event);
  if (!parts?.length) {
    throw createError({ statusCode: 400, statusMessage: "첨부 파일이 없습니다." });
  }

  const publicDir = join(process.cwd(), "public");
  const dir = join(publicDir, "uploads", "notices", String(id));
  try {
    mkdirSync(dir, { recursive: true });
  } catch (e) {
    logger.warn("mkdir", dir, e);
  }

  const created: { attachId: number; url: string; fileNm: string }[] = [];
  let sortOrder = await (prisma as any).coAttach.count({ where: { refType: REF_TYPE, refId: id } });

  for (const part of parts) {
    if (!part.data || !part.filename) continue;
    const ext = getExt(part.filename);
    if (!ALLOWED_EXT.has(ext)) {
      continue;
    }
    if (part.data.length > MAX_FILE_SIZE) continue;

    const physicalNm = `${randomUUID()}_${part.filename}`;
    const filePath = join(dir, physicalNm);
    const urlPath = `/uploads/notices/${id}/${physicalNm}`;
    writeFileSync(filePath, part.data);

    const mimeType = part.type ?? "";
    const row = await (prisma as any).coAttach.create({
      data: {
        refType: REF_TYPE,
        refId: id,
        physicalNm,
        fileNm: part.filename,
        ext,
        fileSize: part.data.length,
        mimeType: mimeType || undefined,
        url: urlPath,
        sortOrder: sortOrder++,
      },
    });
    created.push({ attachId: row.attachId, url: urlPath, fileNm: part.filename });
  }

  logger.info("[api] ◀", method, url, "uploaded=" + created.length);
  return { uploaded: created };
});
