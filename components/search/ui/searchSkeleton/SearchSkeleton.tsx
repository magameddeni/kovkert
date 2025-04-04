import React from 'react'
import { Skeleton } from '@/components/UI'

const sizes: Record<number, string> = {
  0: '55%',
  1: '80%',
  2: '60%',
  3: '88%'
}

const SearchSkeleton = () => (
  <Skeleton>
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} style={{ padding: '12px 16px' }}>
        <Skeleton.Item height={14} width={sizes[i]} />
      </div>
    ))}
  </Skeleton>
)

export default SearchSkeleton
