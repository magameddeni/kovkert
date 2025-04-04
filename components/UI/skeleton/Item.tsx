import React from 'react'
import Skeleton from 'react-loading-skeleton'

interface ISkeletonProps {
  className?: string | undefined
  width?: string | number | undefined
  height?: string | number | undefined
  count?: number
}

export const Item = ({ className, width, height, count }: ISkeletonProps) => (
  <Skeleton
    className={className as string}
    width={width as string | number}
    height={height as string | number}
    count={count as number}
  />
)
