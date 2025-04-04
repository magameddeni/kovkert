export const convertPrice = (price?: number) => {
  if (!price) return price
  return Math.round(price * 100) / 100
}
