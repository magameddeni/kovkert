import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { routes } from '@/constants'
import { useRemoveBasketItemMutation } from '@/redux/basket/basketApi'
import { removeBasketItemsLocal } from '@/redux/basket/basketSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { IBasketItem, IBasketItemProduct, IProduct, TAffiliateProperties } from '@/models'
import { useWindowSize, useMessage, useDebounce, useChangeBasketItem } from '@/hooks'
import { Button, Icon, Input, Text } from '@/components/UI'
import emitter, { EVENTS } from '@/utils/emitter'
import s from './basket.module.scss'

interface IAddToBasketButtonProps {
  product: IProduct | IBasketItemProduct
  text?: string
  disabled?: boolean
  fluid?: boolean | undefined
  view?: 'primary' | 'basket'
  removeOnLastItem?: boolean
  textSize?: string | undefined
  asInput?: boolean
  affiliateProperties?: TAffiliateProperties
  withAuth?: boolean
}

const AddToBasketButton = ({
  product,
  text = 'В корзину',
  disabled,
  fluid,
  view,
  removeOnLastItem = true,
  textSize,
  asInput = false,
  affiliateProperties,
  withAuth = false
}: IAddToBasketButtonProps) => {
  const [removeBasketItem, { isLoading: isLoadingRemove }] = useRemoveBasketItemMutation()
  const { isLarge } = useWindowSize()
  const { changeBasketItemCount, isLoading } = useChangeBasketItem()
  const basket = useAppSelector(({ beru }) => beru.basket)
  const auth = useAppSelector(({ beru }) => beru.user)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isStock = product?.stock > 0
  const basketView = view === 'basket'

  const currentProduct: IBasketItem | undefined = basket?.data?.find(
    (basketItem: IBasketItem) => basketItem?.product?._id === product._id
  )

  const [productQuantityInput, setProductQuantityInput] = useState(currentProduct?.quantity)
  const debouncedProductQuantity = useDebounce(productQuantityInput, 300)
  const productQuantity = currentProduct?.quantity || 0

  const classList = cx(s['add-to-basket-button'], {
    [s[`view-${view}`]]: view,
    [s.fluid]: fluid
  })

  const removeItemBasket = async () => {
    if (auth.isLoggedIn) {
      try {
        await removeBasketItem([
          {
            basketId: auth?.data?.basketId,
            items: [currentProduct?.product._id]
          }
        ])
      } catch (error: any) {
        console.error(error)
      }
    } else {
      dispatch(removeBasketItemsLocal([currentProduct?.product?._id]))
    }
  }

  const increaseItemCount = () => {
    if ('stock' in product && productQuantity >= product?.stock) {
      return useMessage('Превышено кол-во товара', 'error')
    }

    void changeBasketItemCount(
      currentProduct ? (productQuantity > 998 ? 999 : productQuantity + 1) : 1,
      product,
      affiliateProperties
    )
  }

  const decreaseItemCount = async () => {
    if (currentProduct) {
      if (productQuantity === 1) {
        if (!removeOnLastItem) return
        return removeItemBasket()
      }
      await changeBasketItemCount(productQuantity - 1, product, affiliateProperties)
    }
  }

  const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = +e.target.value

    if (inputValue < 1) return setProductQuantityInput(1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = +e.target.value

    if (!isNaN(inputValue)) {
      if (inputValue > product.stock) return setProductQuantityInput(product.stock)
      if (inputValue > 999) return setProductQuantityInput(999)

      setProductQuantityInput(inputValue)
    }
  }

  const handleNotCurrentProductClick = () => {
    if (!withAuth || (withAuth && auth.isLoggedIn)) {
      return increaseItemCount()
    }

    return emitter.emit(EVENTS.SHOW_LOGIN_MODAL)
  }

  useEffect(() => {
    if (asInput && debouncedProductQuantity && debouncedProductQuantity !== currentProduct?.quantity) {
      void changeBasketItemCount(debouncedProductQuantity, product, affiliateProperties)
    }
  }, [asInput, debouncedProductQuantity, currentProduct])

  if (!isStock) {
    return (
      <Text as='p' size={textSize ?? 'lg'} className={cx(s['add-to-basket-button'], s['not-in-stock'])}>
        Нет в наличии
      </Text>
    )
  }

  if (!currentProduct) {
    return (
      <Button onClick={handleNotCurrentProductClick} disabled={disabled || isLoading} fluid={fluid}>
        {text}
      </Button>
    )
  }

  return (
    <div className={classList}>
      <Button
        className={s['handler-button']}
        disabled={isLoading || isLoadingRemove || (!removeOnLastItem && productQuantity === 1)}
        onClick={decreaseItemCount}
      >
        <Icon name='minus' size='md' />
      </Button>
      <div className={s.counter} onClick={!basketView ? () => router.push(routes.BASKET) : () => {}}>
        {isLarge && !basketView && <Text size='xxs'>В корзине</Text>}
        {asInput ? (
          <Input
            name='counter'
            classNameInputWrapper={s.counter__input}
            className={s.input}
            value={productQuantityInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            disabled={isLoading || isLoadingRemove}
            view='light'
            textCenter
          />
        ) : (
          <Text as='p' className={s.counter__text}>
            {productQuantity}
            {!basketView && <Text color='blue'>шт</Text>}
          </Text>
        )}
      </div>
      <Button
        className={s['handler-button']}
        disabled={isLoading || isLoadingRemove || productQuantity >= product?.stock}
        onClick={increaseItemCount}
      >
        <Icon name='plus' size='md' />
      </Button>
    </div>
  )
}

export default AddToBasketButton
