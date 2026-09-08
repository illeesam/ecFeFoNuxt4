/**
 * 가격을 한국 원화로 표시 (데이터는 원 단위로 저장, 금액 포맷)
 * 예: 230000 → "230,000원"
 */
export const usePrice = () => {
  const formatPrice = (price: number | undefined | null): string => {
    if (price == null || Number.isNaN(Number(price))) return "0원";
    const krPrice = Math.round(Number(price));
    return krPrice.toLocaleString("ko-KR") + "원";
  };
  return { formatPrice };
};
