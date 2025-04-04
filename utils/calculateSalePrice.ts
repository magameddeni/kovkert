import { convertPrice } from '@/helpers'

export const calculateSalePrice = (originalPrice: number, discountPercentage: number) => {
  const discountDecimal = discountPercentage / 100
  const salePrice = originalPrice * discountDecimal

  return convertPrice(salePrice)
}
