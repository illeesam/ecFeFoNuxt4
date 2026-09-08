import { prisma } from "~~/server/utils/prisma";
import { logger } from "~~/server/utils/logger";

/** 리뷰 또는 답글 삭제. 부모 리뷰 삭제 시 답글은 FK CASCADE로 함께 삭제됨 */
export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);

  const productId = Number(getRouterParam(event, "id"));
  const reviewId = Number(getRouterParam(event, "reviewId"));
  if (!Number.isInteger(productId) || productId < 1 || !Number.isInteger(reviewId) || reviewId < 1) {
    throw createError({ statusCode: 400, statusMessage: "잘못된 요청입니다." });
  }

  const review = await (prisma as any).productReview.findFirst({
    where: { productReviewId: reviewId, productId },
  });
  if (!review) {
    throw createError({ statusCode: 404, statusMessage: "해당 리뷰를 찾을 수 없습니다." });
  }

  await (prisma as any).productReview.delete({
    where: { productReviewId: reviewId },
  });

  const message = review.parentReviewId != null ? "답글이 삭제되었습니다." : "리뷰가 삭제되었습니다.";
  logger.info("[api] ◀", method, url, "deleted reviewId=" + reviewId);
  return { success: true, message };
});
