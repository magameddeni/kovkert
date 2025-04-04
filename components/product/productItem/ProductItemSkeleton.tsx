import React from 'react'
import { Skeleton } from '@/components/UI'
import { useWindowSize } from '@/hooks'

type TSkeletonHeight = {
  [key: string]: {
    image: number
    info: number
  }
}

export const ProductItemSkeleton = () => {
  const { deviceWidth } = useWindowSize()

  const skeletonHeight: TSkeletonHeight = {
    small: {
      image: 144,
      info: 99
    },
    medium: {
      image: 201,
      info: 109
    },
    large: {
      image: 224,
      info: 109
    }
  }

  if (!deviceWidth) return null

  return (
    <Skeleton>
      <div>
        <Skeleton.Item height={skeletonHeight[deviceWidth].image} />
        <div className='offset-top-12' />
        <Skeleton.Item height={skeletonHeight[deviceWidth].info} />
        <div className='offset-top-12' />
        <Skeleton.Item height={46} />
      </div>
    </Skeleton>
  )
}
