export const useProductPrice = (
  currentPrice: number,
  prevPrice?: number | undefined,
  affiliateDiscount?: number | undefined
): {
  current: number
  prev: number
} => {
  const affDiscount = affiliateDiscount ?? 0

  return {
    current: affDiscount ? currentPrice * (1 - affDiscount / 100) : currentPrice,
    prev: affDiscount ? currentPrice : prevPrice ?? 0
  }
}
