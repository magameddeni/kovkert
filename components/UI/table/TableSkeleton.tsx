import React from 'react'
import { Skeleton } from '../skeleton'

const TableSkeleton = () => (
  <Skeleton>
    {new Array(20).fill('').map(() => (
      <Skeleton.Item key={Math.random()} height={32} />
    ))}
  </Skeleton>
)

export default TableSkeleton
