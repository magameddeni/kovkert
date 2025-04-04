import React, { PropsWithChildren } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import { Item } from './Item'
import 'react-loading-skeleton/dist/skeleton.css'

interface ISkeletonWrapperProps extends PropsWithChildren {
  color?: string | undefined
}

const Skeleton = React.memo(({ children, color = '#ebebeb' }: ISkeletonWrapperProps) => (
  <SkeletonTheme baseColor={color as string}>{children}</SkeletonTheme>
))

export default Object.assign(Skeleton, {
  Item
})
