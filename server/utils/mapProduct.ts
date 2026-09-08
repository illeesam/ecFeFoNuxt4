import type { CoCategoryType } from "~/types/coCategoryType";
import type { CoBrandType } from "~/types/coBrandType";
import type { PdReviewType } from "~/types/pdReviewType";

/**
 * DB row shape (Prisma 반환). app types와 필드명이 다를 수 있음 (예: productReviewId vs reviewId).
 */
interface ProductRow {
  productId: number;
  img: string;
  thumbImg: string | null;
  bannerImg: string | null;
  bigImg: string | null;
  title: string;
  price: number;
  oldPrice: number | null;
  rating: number | null;
  quantity: number;
  smDesc: string | null;
  weight: number | null;
  dimension: string | null;
  categoryId: number | null;
  brandId: number | null;
  trending: boolean | null;
  banner: boolean | null;
  saleOfPer: number | null;
  isNew: boolean | null;
  bestSeller: boolean | null;
  topRated: boolean | null;
  relatedImages: string[];
  details: unknown;
  optionSizes: unknown;
  optionColors: unknown;
}

/** DB product_review row (API 출력은 PdReviewType) */
interface ProductReviewRow {
  productReviewId: number;
  parentReviewId: number | null;
  img: string | null;
  name: string;
  time: string;
  rating: number;
  content: string | null;
  attachments: string[] | null;
  isChildren: boolean | null;
  replies?: ProductReviewRow[];
}

/** DB category row (API 출력은 CoCategoryType) */
interface CategoryRow {
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  categoryLevel: number;
  parentCategory: string | null;
}

/** DB brand row (API 출력은 CoBrandType) */
interface BrandRow {
  brandId: number;
  brandCode: string;
  brandName: string;
}

export type ProductWithRelations = ProductRow & {
  category: CategoryRow | null;
  brand: BrandRow | null;
  reviews: ProductReviewRow[];
};

type CodeToCategory = Map<string, CategoryRow>;

/** DB product + relations → API shape (app types: CoCategoryType, CoBrandType, PdReviewType) */
export function mapProduct(p: ProductWithRelations, parentByCode: CodeToCategory): Record<string, unknown> {
  const category: CoCategoryType | undefined = p.category
    ? {
        categoryId: p.category.categoryId,
        categoryCode: p.category.categoryCode,
        categoryName: p.category.categoryName,
        categoryLevel: p.category.categoryLevel,
      }
    : undefined;
  const parentCategory: CoCategoryType | undefined = p.category?.parentCategory
    ? (() => {
        const parent = parentByCode.get(p.category!.parentCategory!);
        return parent
          ? {
              categoryId: parent.categoryId,
              categoryCode: parent.categoryCode,
              categoryName: parent.categoryName,
              categoryLevel: parent.categoryLevel,
            }
          : undefined;
      })()
    : undefined;
  const brand: CoBrandType | undefined = p.brand
    ? {
        brandId: p.brand.brandId,
        brandCode: p.brand.brandCode,
        brandName: p.brand.brandName,
      }
    : undefined;
  const mapOne = (r: ProductReviewRow): PdReviewType => {
    const base: PdReviewType = {
      reviewId: r.productReviewId,
      img: r.img ?? "",
      name: r.name,
      time: r.time,
      rating: r.rating,
    };
    if (r.content != null) base.content = r.content;
    if (Array.isArray(r.attachments) && r.attachments.length) base.attachments = r.attachments;
    if (r.isChildren) base.children = true;
    if (r.replies?.length) base.replies = r.replies.map(mapOne);
    return base;
  };
  const topLevel = (p.reviews ?? []).filter((r: ProductReviewRow) => r.parentReviewId == null);
  const reviews: PdReviewType[] = topLevel.map(mapOne);

  return {
    productId: p.productId,
    img: p.img,
    thumbImg: p.thumbImg ?? undefined,
    bannerImg: p.bannerImg ?? undefined,
    bigImg: p.bigImg ?? undefined,
    title: p.title,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    rating: p.rating ?? 0,
    quantity: p.quantity,
    smDesc: p.smDesc ?? undefined,
    weight: p.weight ?? undefined,
    dimension: p.dimension ?? undefined,
    category,
    parentCategory,
    brand,
    relatedImages: p.relatedImages ?? [],
    details: (p.details as Record<string, unknown>) ?? undefined,
    optionSizes: (p.optionSizes as unknown[]) ?? [],
    optionColors: (p.optionColors as unknown[]) ?? [],
    reviews,
    trending: p.trending ?? false,
    banner: p.banner ?? false,
    saleOfPer: p.saleOfPer ?? undefined,
    new: p.isNew ?? false,
    bestSeller: p.bestSeller ?? false,
    topRated: p.topRated ?? false,
  };
}

/** Build code → Category map for parentCategory lookup */
export function buildParentCategoryMap(categories: CategoryRow[]): CodeToCategory {
  const map = new Map<string, CategoryRow>();
  for (const c of categories) {
    map.set(c.categoryCode, c);
  }
  return map;
}
