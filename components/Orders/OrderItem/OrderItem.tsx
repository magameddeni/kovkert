import React from 'react'
import { useRouter } from 'next/router'
import { routes } from '@/constants'
import { Button } from '@/components/UI'
import { IOrderItem } from '@/models/order'
import { setSpaceBetweenCharacters } from '@/helpers'
import { ProductImage } from '@/components/product'
import s from './order_product.module.scss'

interface IOrderItemProps {
  item: IOrderItem
  status: string | undefined | null
}

const OrderItem = ({ item, status }: IOrderItemProps) => {
  const router = useRouter()

  const toReviewPage = async () => {
    await router.push({
      pathname: `${routes.REVIEWS}/${item.product._id}`,
      query: { mode: item.product.review ? 'edit' : 'create' }
    })
  }

  return (
    <div className={s.card}>
      <ProductImage link={item.product.images[0].link} id={item.product._id} className={s.card__image_block} />
      <div className={s.card__info}>
        <div className={s.card__name}>{item.product.productName}</div>
        <div className={s.card__price}>{setSpaceBetweenCharacters(item.price)} ₽</div>
        {status === 'Доставлено' && (
          <div className={s.card__add_review}>
            <Button onClick={toReviewPage} className={s['card__add_review-button']} view='secondary'>
              {item.product.review ? 'Редактировать отзыв' : 'Написать отзыв'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderItem
