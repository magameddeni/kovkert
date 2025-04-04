import { addBasketItemsLocal } from '@/redux/basket/basketSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { useAddBasketItemMutation } from '@/redux/basket/basketApi'
import { useProductPrice } from '@/hooks'
import { IBasketItemProduct, IProduct, TAffiliateProperties } from '@/models'

export const useChangeBasketItem = () => {
  const [addBasketItem, { isLoading, error }] = useAddBasketItemMutation()
  const auth = useAppSelector(({ beru }) => beru.user)
  const dispatch = useAppDispatch()

  const changeBasketItemCount = async (
    quantity: number,
    product: IProduct | IBasketItemProduct,
    affiliateProperties?: TAffiliateProperties
  ) => {
    const price = useProductPrice(product.discountPrice, product?.regularPrice, affiliateProperties?.affiliateDiscount)

    if (auth.isLoggedIn) {
      try {
        await addBasketItem([
          {
            basketId: auth?.data?.basketId,
            product: { _id: product._id, shop: { _id: product.shop._id } },
            quantity,
            price: parseInt(product.discountPrice as unknown as string),
            ...affiliateProperties
          }
        ])
      } catch (err: any) {
        console.error(err)
      }
    } else {
      dispatch(
        addBasketItemsLocal([
          {
            product: {
              _id: product._id,
              discountPrice: parseInt(price.current as unknown as string),
              regularPrice: parseInt(price.prev as unknown as string),
              images: product.images,
              productName: product.productName,
              shop: {
                _id: product.shop._id,
                name: product.shop.name,
                slug: product.shop.slug
              },
              stock: product.stock
            },
            quantity,
            selected: true
          }
        ])
      )
    }
  }

  return { changeBasketItemCount, isLoading, error }
}
