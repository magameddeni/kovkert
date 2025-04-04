import React from 'react'
import { setSpaceBetweenCharacters } from '@/helpers'
import { IOrderGroupOrderItem } from '@/models'
import { ProductImage } from '@/components/product'
import s from './order_item_thumbnail.module.scss'

interface IOrderItemThumbnailProps {
  item: IOrderGroupOrderItem
}

const OrderItemThumbnail = ({ item }: IOrderItemThumbnailProps) => {
  if (!item) return null

  return (
    <div className={s.card}>
      <ProductImage link={item.product.image} id={item.product._id} className={s.card__image_block} />
      <div>
        <div className={s.card__price}>{setSpaceBetweenCharacters(item.price)} ₽</div>
        <div className={s.card__qty}>{item.quantity} шт.</div>
      </div>
    </div>
  )
}

export default OrderItemThumbnail
