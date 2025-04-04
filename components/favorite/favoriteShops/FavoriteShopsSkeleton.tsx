import React from 'react'
import { Col, Skeleton } from '@/components/UI'

export const FavoriteShopsSkeleton = () =>
  Array(6)
    .fill('')
    .map(() => (
      <Col sm={6} lg={4}>
        <Skeleton>
          <Skeleton.Item height={112} />
        </Skeleton>
      </Col>
    ))
