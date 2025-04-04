import React, { ChangeEvent, useMemo } from 'react'
import Link from 'next/link'
import cx from 'classnames'
import { IBasketItem, IProduct } from '@/models'
import { routes } from '@/constants'
import { useRemoveBasketItemMutation } from '@/redux/basket/basketApi'
import { removeBasketItemsLocal } from '@/redux/basket/basketSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { useProductPrice, useSelectBasketItem, useWindowSize } from '@/hooks'
import { setSpaceBetweenCharacters } from '@/helpers'
import { Checkbox, Icon, Text } from '@/components/UI'
import { ProductImage, ProductPrice } from '@/components/product'
import { AddToFavoritesButton } from '@/components/favorite'
import BasketProductItemSkeleton from './BasketProductItemSkeleton'
import AddToBasketButton from './AddToBasketButton'
import s from './basket.module.scss'

interface IBasketProductItemProps {
  item: IBasketItem
  outStock?: boolean
}

const BasketProductItem = ({ item, outStock = false }: IBasketProductItemProps) => {
  const { selectBasketItemCount, isLoading: isSelecting } = useSelectBasketItem()
  const { isLarge } = useWindowSize()
  const dispatch = useAppDispatch()

  const [removeBasketItem, { isLoading: isRemoving }] = useRemoveBasketItemMutation()
  const user = useAppSelector(({ beru }) => beru.user)

  const price = useProductPrice(item.product.discountPrice, item.product?.regularPrice, item?.affiliateDiscount)

  const affiliateProperties = useMemo(() => {
    if (item?.affiliateDiscount) {
      return {
        affiliateDiscount: item.affiliateDiscount,
        affiliateCode: item.affiliateCode
      }
    }

    return undefined
  }, [item])

  const selectItem = (isSelect: boolean) =>
    selectBasketItemCount(isSelect, [user.isLoggedIn ? (item._id as string) : item.product._id])

  const removeItemBasket = async () => {
    if (user.isLoggedIn) {
      try {
        await removeBasketItem([
          {
            basketId: user?.data?.basketId,
            items: [item.product._id]
          }
        ])
      } catch (error: any) {
        console.error(error)
      }
    } else {
      dispatch(removeBasketItemsLocal([item.product._id]))
    }
  }

  if (!item?.product) {
    return <BasketProductItemSkeleton />
  }

  return (
    <div className={s['basket-product-item']}>
      <div className={s['basket-product-item__select-and-img']}>
        <Checkbox
          name='select'
          checked={item.selected}
          onChange={(e: ChangeEvent<HTMLInputElement>) => !outStock && selectItem(e.target.checked)}
          disabled={isSelecting || !item.product.stock}
        />
        <ProductImage
          id={item.product._id}
          link={item.product?.images?.[0]?.link}
          className={cx(s['product-img'], {
            [s['product-img-fill']]: outStock
          })}
          addToFavorite={false}
          product={item.product as IProduct}
        />
      </div>
      <div className={s['basket-product-item__content']}>
        <Link href={`${routes.PRODUCT}/${item.product._id}`}>
          <Text color={outStock ? 'gray' : undefined} size='md'>
            {item.product.productName}
          </Text>
        </Link>
        {outStock ? (
          <Text color='red' as='p' size='xxs' className='offset-top-8'>
            Нет в наличии
          </Text>
        ) : (
          <ProductPrice
            discountPrice={price.current}
            regularPrice={price.prev}
            classNameWrapper='offset-top-8'
            view='secondary'
            discountPriceSize='xxs'
            regularPriceSize='xxs'
            withSuffix
          />
        )}
        <div className={cx(s['product-control-buttons'], { [s['product-control-outstock']]: outStock })}>
          <AddToFavoritesButton item={item.product as IProduct} size={isLarge ? 'lg' : 'md'} color='gray' />
          <Icon
            name='basket'
            color='gray'
            className={s['basket-icon']}
            onClick={removeItemBasket}
            disable={isRemoving}
          />
        </div>
      </div>
      {!outStock && (
        <div className={s['basket-product-item__price-and-quantity']}>
          <Text as='p' className={s['product-final-price']} size='md' family='secondary'>
            {setSpaceBetweenCharacters(+price.current * item.quantity) as number} ₽
          </Text>
          <AddToBasketButton
            product={item.product}
            view='basket'
            removeOnLastItem={false}
            affiliateProperties={affiliateProperties}
            asInput
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(BasketProductItem)
