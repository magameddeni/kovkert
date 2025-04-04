import React from 'react'
import { Skeleton } from '@/components/UI'
import { useWindowSize } from '@/hooks'

export const ProductItemHorizontalSkeleton = () => {
  const { deviceWidth } = useWindowSize()

  if (!deviceWidth) return null

  return (
    <Skeleton>
      <Skeleton.Item height={210} />
    </Skeleton>
  )
}
