import { IBasketItem } from '@/models'

export const groupBasketItemsByShop = (basketData: IBasketItem[], onlySelected: boolean = false) => {
  if (!basketData || !basketData.length) return {}

  const groupedItemsByShop: { [shopId: string]: { inStock: IBasketItem[]; outStock: IBasketItem[] } } = {}

  basketData.forEach((v: IBasketItem) => {
    const shopId = v.product?.shop?._id

    if (shopId) {
      if (!onlySelected || v.selected) {
        if (!v.product.stock) {
          if (!groupedItemsByShop[shopId]) return (groupedItemsByShop[shopId] = { inStock: [], outStock: [v] })
          groupedItemsByShop[shopId].outStock.push(v)
          return
        }

        if (!groupedItemsByShop[shopId]) return (groupedItemsByShop[shopId] = { outStock: [], inStock: [v] })
        groupedItemsByShop[shopId].inStock.push(v)
      }
    }
  })

  return groupedItemsByShop
}
