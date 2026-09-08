/**
 * 장바구니 Pinia 스토어.
 * 담은 상품 목록, 수량, 합계를 관리하고 localStorage와 동기화합니다.
 */
import { defineStore } from "pinia";
import { type PdProductType } from "~/types/pdProductType";
import { type OrCartItemType } from "~/types/orCartItemType";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartProducts: [] as OrCartItemType[], // 장바구니에 담긴 상품 목록
    orderQuantity: 1 as number, // 주문 수량 (추가 시 적용)
    quantityCount: 0 as number, // 전체 수량 합계
    total: 0 as number, // 총 금액
  }),
  actions: {
    addStCartProduct(payload: PdProductType) {
      // 상품을 장바구니에 추가 (이미 있으면 수량만 증가)
      const isExist = this.cartProducts.some((i) => i.productId === payload.productId);
      if (!isExist) {
        const newItem: OrCartItemType = {
          ...payload,
          orderQuantity: 1,
        };
        this.cartProducts.push(newItem);
        useNuxtApp().$toast.success(`${payload.title} 장바구니에 추가됨`);
      } else {
        this.cartProducts.map((item) => {
          if (item.productId === payload.productId) {
            if (typeof item.orderQuantity !== "undefined") {
              if (item.quantity >= item.orderQuantity + this.orderQuantity) {
                item.orderQuantity = this.orderQuantity !== 1 ? this.orderQuantity + item.orderQuantity : item.orderQuantity + 1;
                useNuxtApp().$toast.success(`${this.orderQuantity}개 ${item.title} 장바구니에 추가됨`);
              } else {
                useNuxtApp().$toast.error(`해당 상품의 재고가 없습니다.`);
                this.orderQuantity = 1;
              }
            }
          }
          return { ...item };
        });
      }
      localStorage.setItem("cart_products", JSON.stringify(this.cartProducts));
    },
    setStQuantityDecrement(payload: PdProductType) {
      // 해당 상품 수량 1 감소 (1 미만으로 내려가지 않음)
      this.cartProducts.map((item) => {
        if (item.productId === payload.productId) {
          if (typeof item.orderQuantity !== "undefined") {
            if (item.orderQuantity > 1) {
              item.orderQuantity = item.orderQuantity - 1;
            }
          }
        }
        return { ...item };
      });
      localStorage.setItem("cart_products", JSON.stringify(this.cartProducts));
    },
    // remover_cart_products
    removerStCartProducts(payload: PdProductType) {
      this.cartProducts = this.cartProducts.filter((p) => p.productId !== payload.productId);
      useNuxtApp().$toast.error(`${payload.title} 장바구니에서 제거됨`);
      localStorage.setItem("cart_products", JSON.stringify(this.cartProducts));
    },
    async clearStCart() {
      // 장바구니 전체 비우기 (확인 후)
      const nuxtApp = useNuxtApp();
      const ok = await nuxtApp.$confirm({
        title: "삭제 확인",
        message: "장바구니의 모든 상품을 삭제하시겠습니까?",
        confirmText: "삭제",
        cancelText: "취소",
        variant: "danger",
      });
      if (ok) {
        this.cartProducts = [];
      }
      localStorage.setItem("cart_products", JSON.stringify(this.cartProducts));
    },
    initialStOrderQuantity() {
      this.orderQuantity = 1; // 추가 시 적용할 수량을 1로 초기화
    },
  },
  getters: {
    getStTotalPriceQuantity: (state) => {
      // 장바구니 총 수량·총 금액 계산
      return state.cartProducts.reduce(
        (cartTotal, cartItem) => {
          const { price, orderQuantity } = cartItem;
          if (typeof orderQuantity !== "undefined") {
            const itemTotal = price * orderQuantity;
            cartTotal.quantity += orderQuantity;
            cartTotal.total += itemTotal;
          }
          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        },
      );
    },
    loadStCartProducts: (state) => {
      // localStorage에서 장바구니 불러와 state 동기화
      if (process.client) {
        const data = localStorage.getItem("cart_products");
        if (data) {
          return (state.cartProducts = JSON.parse(data));
        } else {
          localStorage.setItem("cart_products", JSON.stringify([]));
          return (state.cartProducts = []);
        }
      } else {
        return state.cartProducts;
      }
    },
  },
});
