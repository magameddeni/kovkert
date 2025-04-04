import React from 'react'
import { useWindowSize } from '@/hooks'
import { Skeleton } from '@/components/UI'

export const OrderListSkeleton = () => {
  const { deviceWidth } = useWindowSize()

  const skeletonHeight = {
    small: 260,
    medium: 275,
    large: 300
  }

  if (!deviceWidth) return null

  return (
    <Skeleton>
      {Array.from({ length: 2 }, (_, i) => (
        <Skeleton.Item key={i} height={skeletonHeight[deviceWidth]} />
      ))}
    </Skeleton>
  )
}
