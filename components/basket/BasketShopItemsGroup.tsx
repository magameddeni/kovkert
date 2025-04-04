import React, { useMemo } from 'react'
import Link from 'next/link'
import cx from 'classnames'
import { IBasketItem } from '@/models'
import { routes } from '@/constants'
import { useSelectBasketItem } from '@/hooks'
import { useRemoveBasketItemMutation } from '@/redux/basket/basketApi'
import { removeBasketItemsLocal } from '@/redux/basket/basketSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { Checkbox, Icon, Text } from '@/components/UI'
import BasketProductItem from './BasketProductItem'
import s from './basket.module.scss'

interface IBasketShopItemsGroupProps {
  shopId: string | undefined
  inStock: IBasketItem[]
  outStock: IBasketItem[]
}

const BasketShopItemsGroup = ({ shopId, inStock, outStock }: IBasketShopItemsGroupProps) => {
  const dispatch = useAppDispatch()
  const { selectBasketItemCount, isLoading: isSelecting } = useSelectBasketItem()

  const [removeBasketItem, { isLoading: isRemoving }] = useRemoveBasketItemMutation()
  const user = useAppSelector(({ beru }) => beru.user)

  const isSelectedAll = useMemo(() => inStock.every((v: IBasketItem) => v.selected), [inStock])

  const handleSelectAll = () => {
    try {
      if (user.isLoggedIn) {
        const selectedItemIds = inStock.filter((v: IBasketItem) => v.selected).map((v: IBasketItem) => v._id)

        if (!selectedItemIds.length) {
          return selectBasketItemCount(true, inStock.map((v: IBasketItem) => v._id) as Array<string>)
        }

        selectBasketItemCount(
          !isSelectedAll,
          (isSelectedAll
            ? selectedItemIds
            : inStock.filter((v: IBasketItem) => !v.selected).map((v: IBasketItem) => v._id)) as Array<string>
        )
      } else {
        const selectedProductIds = inStock.filter((v: IBasketItem) => v.selected).map((v: IBasketItem) => v.product._id)

        if (!selectedProductIds.length) {
          return selectBasketItemCount(true, inStock.map((v: IBasketItem) => v.product._id) as Array<string>)
        }

        selectBasketItemCount(
          !isSelectedAll,
          isSelectedAll
            ? selectedProductIds
            : inStock.filter((v: IBasketItem) => !v.selected).map((v: IBasketItem) => v.product._id)
        )
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  const handleRemoveItems = async (type: string) => {
    const itemIds =
      type === 'inStock'
        ? inStock.filter((v: IBasketItem) => v.selected).map((v: IBasketItem) => v.product._id)
        : outStock.map((v: IBasketItem) => v.product._id)

    if (user.isLoggedIn) {
      try {
        await removeBasketItem([
          {
            basketId: user?.data?.basketId,
            items: itemIds
          }
        ])
      } catch (error: any) {
        console.error(error)
      }
    } else {
      dispatch(removeBasketItemsLocal(itemIds))
    }
  }

  const items = inStock[0] ?? outStock[0]

  if (!shopId || !items) return null

  return (
    <div className={s['basket-shop-items-group']}>
      {items.product?.shop?.slug ? (
        <Link href={`${routes.SHOP}/${items.product.shop?.slug}`} className={s['shop-title']}>
          <Text family='secondary'>{items.product.shop.name}</Text>
        </Link>
      ) : (
        <div className={s['shop-title']}>
          <Text>{inStock[0].product.shop.name}</Text>
        </div>
      )}
      <div className={s['product-selects']}>
        <Checkbox
          name='select-all'
          label='Выбрать все'
          checked={isSelectedAll}
          onChange={handleSelectAll}
          disabled={isSelecting || inStock.every((v: IBasketItem) => !v.product.stock)}
        />
        {inStock.some((v: IBasketItem) => v.selected) && (
          <div
            className={cx(s['remove-selected'], { [s.disable]: isRemoving })}
            onClick={() => handleRemoveItems('inStock')}
          >
            <Icon name='basket' size='md' color='gray' />
            <Text color='gray'>Удалить выбранные</Text>
          </div>
        )}
      </div>
      <div className='offset-top-16'>
        {inStock.map((v: IBasketItem) => (
          <BasketProductItem key={Math.random()} item={v} />
        ))}
      </div>
      {Boolean(outStock.length) && (
        <div className={cx('offset-top-32', s['remove-out-stock'])}>
          <div className={s['remove-out-stock__header']}>
            <Text weight='medium' color='gray'>
              Недоступны для заказа
            </Text>
            <div className={s['remove-all-out-stock']} onClick={() => handleRemoveItems('outStock')}>
              <Icon name='close' color='gray' />
              <Text color='gray'>Удалить все</Text>
            </div>
          </div>
          <div className='offset-top-16'>
            {outStock.map((v: IBasketItem) => (
              <BasketProductItem outStock key={Math.random()} item={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BasketShopItemsGroup
