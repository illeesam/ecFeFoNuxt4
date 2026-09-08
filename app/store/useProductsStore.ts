/**
 * 상품 목록·필터 Pinia 스토어.
 * 전체 상품은 /api/products 에서 axiosCsr 로 로드.
 * SSR 필요 페이지(shop, product-details/[id])는 useAsyncData + axiosSsr 를 직접 사용.
 */
import { defineStore } from "pinia";
import { axiosCsr } from "~/utils/axiosCsr";
import { type PdProductType } from "~/types/pdProductType";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [] as PdProductType[], // 전체 상품 목록 (원본)
    filterProducts: [] as PdProductType[], // 필터/정렬 적용된 목록
    priceRange: [0, 500000] as [number, number],
    activeCls: "" as string,
    loaded: false, // 최초 로드 여부
  }),

  actions: {
    /** /api/products 에서 상품 목록 로드 (CSR 초기 진입 시) */
    async loadStProducts() {
      if (this.loaded) return;
      try {
        const res = await axiosCsr.get<PdProductType[]>("/api/products");
        this.products = res.data;
        this.filterProducts = res.data;
        this.loaded = true;
      } catch (err) {
        console.error("[useProducts] 상품 로드 실패:", err);
      }
    },

    /** SSR에서 미리 불러온 데이터를 스토어에 주입 */
    setStHydrate(data: PdProductType[]) {
      this.products = data;
      this.filterProducts = data;
      this.loaded = true;
    },

    handleStParentCategory(value: string) {
      this.filterProducts = this.products.filter((p) => (p.parentCategory?.categoryCode ?? String(p.parentCategory?.categoryId)) === value);
      this.activeCls = value;
    },

    handleStCategory(value: string) {
      this.filterProducts = this.products.filter((p) => (p.category?.categoryCode ?? String(p.category?.categoryId))?.toLowerCase() === value.toLowerCase());
      this.activeCls = value;
    },

    onChangeRange(value: [number, number]) {
      this.priceRange = value;
    },

    getStFilterPrice() {
      if (this.priceRange.length) {
        this.filterProducts = this.products.filter((p) => p.price >= this.priceRange[0] && p.price <= this.priceRange[1]);
      }
    },

    handleStSize(size: string) {
      this.filterProducts = this.products.filter((p) => p.optionSizes?.some((opt) => (opt.optionCode ?? String(opt.optionId)) === size));
      this.activeCls = size;
    },

    handleStColor(color: string) {
      this.filterProducts = this.products.filter((p) => p.optionColors?.some((opt) => (opt.optionCode ?? String(opt.optionId)) === color));
      this.activeCls = color;
    },

    handleStBrand(brand: string) {
      this.filterProducts = this.products.filter((p) => (p.brand?.brandCode ?? String(p.brand?.brandId))?.toLowerCase() === brand.toLowerCase());
      this.activeCls = brand;
    },

    handleStSelectFiltering(value: string) {
      switch (value) {
        case "Default Sorting":
          return (this.filterProducts = this.products);
        case "Sort By Trending":
          return (this.filterProducts = this.products.filter((p) => p.trending));
        case "Short By BestSeller":
          return (this.filterProducts = this.products.filter((p) => p.bestSeller));
        case "Price High To Low":
          return (this.filterProducts = this.products.slice().sort((a, b) => b.price - a.price));
        case "Price Low To High":
          return (this.filterProducts = this.products.slice().sort((a, b) => a.price - b.price));
        default:
          return (this.filterProducts = this.products);
      }
    },

    handleStResetFilter() {
      this.filterProducts = this.products;
      this.activeCls = "";
      this.priceRange = [0, 500000];
    },
  },

  getters: {
    getStRelatedProducts(state) {
      return (categoryCode: string, productId: number) => state.products.filter((p) => (p.category?.categoryCode ?? String(p.category?.categoryId))?.toLowerCase() === categoryCode.toLowerCase() && p.productId !== productId).slice(0, 4);
    },
  },
});
