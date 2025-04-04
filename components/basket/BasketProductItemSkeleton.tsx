import React from 'react'
import { useWindowSize } from '@/hooks'
import { Skeleton } from '@/components/UI'
import s from './basket.module.scss'

function BasketProductItemSkeleton() {
  const { isLarge, isMedium, isSmall } = useWindowSize()

  return (
    <Skeleton>
      <div className={s['basket-product-item']} style={{ marginLeft: 30 }}>
        <div className={s['basket-product-item__select-and-img']}>
          <Skeleton.Item width={isLarge ? 106 : isMedium ? 85 : 80} height={isLarge ? 94 : isMedium ? 75 : 70} />
        </div>
        <div className={s['basket-product-item__content']}>
          <Skeleton.Item count={1} width={isSmall ? 200 : 400} height={20} />
          <Skeleton.Item count={1} width={isSmall ? 100 : 170} className='offset-top-8' />
        </div>
        <div className={s['basket-product-item__price-and-quantity']}>
          <Skeleton.Item width={60} height={18} className={s['product-final-price']} />
          <Skeleton.Item width={130} height={42} />
        </div>
      </div>
    </Skeleton>
  )
}

export default BasketProductItemSkeleton
