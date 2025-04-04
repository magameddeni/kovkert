import React from 'react'
import { Skeleton } from '@/components/UI'
import s from './product_reviews.module.scss'

export const ProductReviewsSkeleton = () => (
  <div className={s['product-reviews-skeleton']}>
    <Skeleton>
      <Skeleton.Item height={18} width={290} />
      <Skeleton.Item height={18} width={290} className='offset-top-8' />
      <div className={s['product-reviews-skeleton__footer']}>
        <Skeleton.Item height={18} width={100} />
      </div>
    </Skeleton>
  </div>
)
