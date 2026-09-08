import { prisma } from "~~/server/utils/prisma";
import { mapProduct, buildParentCategoryMap, type ProductWithRelations } from "~~/server/utils/mapProduct";
import { logger } from "~~/server/utils/logger";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const url = getRequestURL(event)?.pathname ?? "";
  logger.info("[api] ▶", method, url);
  const [products, categories] = await Promise.all([
    (prisma as any).product.findMany({
      orderBy: { productId: "asc" },
      include: { category: true, brand: true, reviews: true },
    }),
    (prisma as any).category.findMany(),
  ]);
  const parentByCode = buildParentCategoryMap(categories);
  const out = products.map((p: ProductWithRelations) => mapProduct(p, parentByCode));
  logger.info("[api] ◀", method, url, "list size=" + out.length);
  return out;
});
