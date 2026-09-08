import { prisma } from "~~/server/utils/prisma";
import { mapProduct, buildParentCategoryMap } from "~~/server/utils/mapProduct";
import { logger } from "~~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const id = Number(getRouterParam(event, "id"));
  const [product, categories] = await Promise.all([
    (prisma as any).product.findUnique({
      where: { productId: id },
      include: { category: true, brand: true, reviews: { where: { parentReviewId: null }, include: { replies: true } } },
    }),
    (prisma as any).category.findMany(),
  ]);
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: "상품을 찾을 수 없습니다." });
  }
  const parentByCode = buildParentCategoryMap(categories);
  const out = mapProduct(product, parentByCode);
  const s = JSON.stringify(out);
  logger.info("[api] ◀", method, url, s.length > 200 ? s.slice(0, 200) + "..." : s);
  return out;
});
