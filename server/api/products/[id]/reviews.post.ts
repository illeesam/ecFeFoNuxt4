import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "~~/server/utils/prisma";
import { logger } from "~~/server/utils/logger";

const RATING_MIN = 0.5;
const RATING_MAX = 5;
const RATING_STEP = 0.5;
const MAX_FILES = 10;
const MAX_SIZE_BYTES = 30 * 1024 * 1024;
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp", "mp4", "webm", "mov"]);

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

function getExt(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i >= 0 ? filename.slice(i + 1).toLowerCase() : "";
}

/** pd_review 저장: product_id, name, time, rating, attachments(URL[]) */
export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const productId = Number(getRouterParam(event, "id"));
  if (!Number.isInteger(productId) || productId < 1) {
    throw createError({ statusCode: 400, statusMessage: "잘못된 상품 ID입니다." });
  }

  const contentType = getHeader(event, "content-type") ?? "";
  let name = "";
  let content = "";
  let ratingRaw: number | undefined;
  let parentReviewIdRaw: number | undefined;
  const uploadedUrls: string[] = [];
  let attachMeta: { physicalNm: string; fileNm: string; ext: string; fileSize: number; url: string }[] = [];

  if (contentType.includes("multipart/form-data")) {
    const parts = await readMultipartFormData(event);
    if (!parts?.length) throw createError({ statusCode: 400, statusMessage: "요청 본문을 읽을 수 없습니다." });

    const filesToSave: { data: Uint8Array; filename: string }[] = [];
    let totalSize = 0;

    for (const part of parts) {
      if (part.name === "name" && part.data) {
        name = new TextDecoder().decode(part.data).trim();
        continue;
      }
      if (part.name === "content" && part.data) {
        content = new TextDecoder().decode(part.data).trim();
        continue;
      }
      if (part.name === "rating" && part.data) {
        ratingRaw = Number(new TextDecoder().decode(part.data));
        continue;
      }
      if (part.name === "parentReviewId" && part.data) {
        parentReviewIdRaw = Number(new TextDecoder().decode(part.data));
        continue;
      }
      if (part.name === "files" && part.filename && part.data) {
        const ext = getExt(part.filename);
        if (!ALLOWED_EXT.has(ext)) {
          throw createError({ statusCode: 400, statusMessage: `지원하지 않는 확장자입니다: ${part.filename}` });
        }
        if (filesToSave.length >= MAX_FILES) {
          throw createError({ statusCode: 400, statusMessage: `첨부는 최대 ${MAX_FILES}개까지 가능합니다.` });
        }
        totalSize += part.data.length;
        if (totalSize > MAX_SIZE_BYTES) {
          throw createError({ statusCode: 400, statusMessage: "총 용량은 30MB를 초과할 수 없습니다." });
        }
        filesToSave.push({ data: part.data, filename: part.filename });
      }
    }

    if (!name) throw createError({ statusCode: 400, statusMessage: "이름을 입력해 주세요." });

    const baseDir = join(process.cwd(), "public", "uploads", "reviews");
    await mkdir(baseDir, { recursive: true });
    const prefix = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    for (let i = 0; i < filesToSave.length; i++) {
      const item = filesToSave[i];
      if (!item) continue;
      const ext = getExt(item.filename);
      const safeName = `${prefix}_${i}.${ext}`;
      const filePath = join(baseDir, safeName);
      await writeFile(filePath, Buffer.from(item.data));
      const url = `/uploads/reviews/${safeName}`;
      uploadedUrls.push(url);
      attachMeta.push({
        physicalNm: safeName,
        fileNm: item.filename,
        ext,
        fileSize: item.data.length,
        url,
      });
    }
  } else {
    const body = await readBody(event).catch(() => ({})) as { name?: string; rating?: number; content?: string; parentReviewId?: number };
    name = String(body?.name ?? "").trim();
    content = String(body?.content ?? "").trim();
    ratingRaw = body?.rating;
    parentReviewIdRaw = body?.parentReviewId;
    if (!name) throw createError({ statusCode: 400, statusMessage: "이름을 입력해 주세요." });
  }

  const isReply = Number.isInteger(parentReviewIdRaw) && (parentReviewIdRaw as number) > 0;
  let parentReviewId: number | null = isReply ? (parentReviewIdRaw as number) : null;

  if (isReply) {
    const parentRow = await (prisma as any).productReview.findFirst({ where: { productReviewId: parentReviewId } });
    if (!parentRow || parentRow.productId !== productId) {
      throw createError({ statusCode: 400, statusMessage: "해당 리뷰에 답글을 달 수 없습니다." });
    }
  }

  const rating = Number(ratingRaw);
  const validRating =
    !isReply &&
    Number.isFinite(rating) &&
    rating >= RATING_MIN &&
    rating <= RATING_MAX &&
    Math.abs((rating - RATING_MIN) / RATING_STEP - Math.round((rating - RATING_MIN) / RATING_STEP)) < 1e-6;
  if (!isReply && !validRating) {
    throw createError({ statusCode: 400, statusMessage: "별점을 선택해 주세요. (0.5 ~ 5)" });
  }

  const timeStr = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const review = await (prisma as any).productReview.create({
      data: {
        productId,
        parentReviewId: parentReviewId ?? undefined,
        name,
        time: timeStr,
        rating: isReply ? 0 : rating,
        content: content || undefined,
        img: isReply ? null : (uploadedUrls[0] ?? null),
        isChildren: isReply,
        attachments: isReply ? undefined : (uploadedUrls.length ? uploadedUrls : undefined),
      },
    });
    if (!isReply && attachMeta.length > 0) {
      await (prisma as any).coAttach.createMany({
        data: attachMeta.map((m, i) => ({
          refType: "review",
          refId: review.productReviewId,
          physicalNm: m.physicalNm,
          fileNm: m.fileNm,
          ext: m.ext,
          fileSize: m.fileSize,
          mimeType: MIME_BY_EXT[m.ext] ?? null,
          url: m.url,
          sortOrder: i,
        })),
      });
    }
    const out = {
      success: true,
      message: isReply ? "답글이 등록되었습니다." : "리뷰가 등록되었습니다.",
      id: review.productReviewId,
    };
    logger.info("[api] ◀", method, url, "id=" + review.productReviewId);
    return out;
  } catch (e) {
    logger.error("[reviews.post] Prisma error:", e);
    throw createError({ statusCode: 500, statusMessage: isReply ? "답글 등록에 실패했습니다." : "리뷰 등록에 실패했습니다." });
  }
});
