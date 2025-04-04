import React from 'react'
import { Skeleton } from '@/components/UI'
import s from './ratings_chart.module.scss'

export const ReviewsRatingSkeleton = () => (
  <div className={s.graph}>
    <Skeleton>
      <Skeleton.Item height={24} width={100} />
      {new Array(5).fill('').map((_, i) => (
        <Skeleton.Item key={Math.random()} height={24} className={!i ? 'offset-top-16' : 'offset-top-8'} />
      ))}
    </Skeleton>
  </div>
)
