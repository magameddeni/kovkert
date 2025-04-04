import React from 'react'
import { Skeleton } from '@/components/UI'

const CategoryNavBlockSkeleton = () => (
  <Skeleton>
    <div className='offset-top-24'>
      {Array(3)
        .fill('')
        .map((_, i: number) => (
          <div key={Math.random()} className={i ? 'offset-top-24' : ''}>
            {Array(6)
              .fill('')
              .map((__, j: number) => (
                <Skeleton.Item key={Math.random()} height={18} className={j ? 'offset-top-8' : ''} />
              ))}
          </div>
        ))}
    </div>
  </Skeleton>
)

export default CategoryNavBlockSkeleton
