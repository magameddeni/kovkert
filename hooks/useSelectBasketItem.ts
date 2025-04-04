import { selectBasketItemsLocal } from '@/redux/basket/basketSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { useSelectBasketItemMutation } from '@/redux/basket/basketApi'

export const useSelectBasketItem = () => {
  const [selectBasketItem, { isLoading }] = useSelectBasketItemMutation()
  const auth = useAppSelector(({ beru }) => beru.user)
  const dispatch = useAppDispatch()

  const selectBasketItemCount = (isSelect: boolean, productIds: Array<string>) => {
    try {
      if (auth.isLoggedIn) {
        selectBasketItem([
          {
            basketId: auth?.data?.basketId,
            items: productIds,
            value: isSelect
          }
        ])
      } else {
        dispatch(
          selectBasketItemsLocal({
            items: productIds,
            value: isSelect
          })
        )
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  return { selectBasketItemCount, isLoading }
}
