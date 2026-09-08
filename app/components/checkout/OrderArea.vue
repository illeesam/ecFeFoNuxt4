<template>
  <div class="your-order mb-30">
    <xdev-file-path-badge :file-path="currentFilePath" :absolute="true" />
    <h3>주문 내역</h3>
    <div class="your-order-table table-responsive">
      <table>
        <thead>
          <tr>
            <th class="product-name">상품</th>
            <th class="product-total">합계</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in state.cartProducts" :key="i" class="cart_item">
            <td class="product-name">
              {{ item.title }} <strong class="product-quantity"> x {{ item.orderQuantity }}</strong>
            </td>
            <td class="product-total">
              <span class="amount">{{ formatPrice(item.price) }}</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="cart-subtotal">
            <th>장바구니 소계</th>
            <td>
              <span class="amount">{{ formatPrice(state.getStTotalPriceQuantity.total) }}</span>
            </td>
          </tr>
          <tr class="shipping">
            <th>배송비</th>
            <td>
              <ul>
                <li>
                  <input v-model="ship_cost" :value="7000" id="flat-rate" name="ship-cost" type="radio" />
                  <label for="flat-rate">
                    고정 배송비: <span class="amount">{{ formatPrice(7000) }}</span>
                  </label>
                </li>
                <li>
                  <input v-model="ship_cost" id="free" value="free" name="ship-cost" type="radio" />
                  <label for="free">무료 배송:</label>
                </li>
              </ul>
            </td>
          </tr>
          <tr class="order-total">
            <th>주문 합계</th>
            <td>
              <strong>
                <span class="amount"> {{ formatPrice(typeof ship_cost === "number" && ship_cost > 0 ? state.getStTotalPriceQuantity.total + Number(ship_cost) : state.getStTotalPriceQuantity.total) }} </span>
              </strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="payment-method">
      <div class="accordion" id="accordionExample">
        <div class="card">
          <div class="card-header" id="headingOne">
            <h5 class="mb-0">
              <button class="btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">계좌이체</button>
            </h5>
          </div>

          <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div class="card-body">당사 계좌로 직접 입금해 주세요. 결제 시 주문 번호를 참조란에 기입해 주세요. 입금 확인 후 배송됩니다.</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header" id="headingTwo">
            <h5 class="mb-0">
              <button class="btn-link collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">수표 결제</button>
            </h5>
          </div>
          <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
            <div class="card-body">수표는 당사 주소로 발송해 주세요.</div>
          </div>
        </div>
      </div>
      <div class="order-button-payment mt-20">
        <button type="submit" class="os-btn os-btn-black">주문하기</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch } from "vue";
import type { Ref } from "vue";
import { useCurrentFilePath } from "~/composables/useCurrentFilePath";
const currentFilePath = useCurrentFilePath();
import { useComponentTitle } from "~/composables/useComponentTitle";
useComponentTitle('주문 내역');
import { useCartStore } from "~/store/useCartStore";

const state = useCartStore();
const { formatPrice } = usePrice();
/** 배송비: 숫자(고정비) 또는 'free' */
const ship_cost = ref<number | "free">(0);

/** 결제 시 사용할 주문 합계(부모 CheckoutArea에 전달) */
const orderTotalRef = inject<Ref<number>>("checkoutOrderTotal");
watch(
  [() => state.getStTotalPriceQuantity.total, ship_cost],
  () => {
    if (!orderTotalRef) return;
    const ship = ship_cost.value === "free" || (typeof ship_cost.value === "number" && ship_cost.value === 0)
      ? 0
      : 7000;
    orderTotalRef.value = state.getStTotalPriceQuantity.total + ship;
  },
  { immediate: true }
);
</script>
