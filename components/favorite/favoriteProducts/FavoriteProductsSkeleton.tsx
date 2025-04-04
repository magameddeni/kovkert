import React from 'react'
import { Col } from '@/components/UI'
import { ProductItemSkeleton } from '@/components/product'
import styles from './styles.module.scss'

export const FavoriteProductsSkeleton = () =>
  Array(10)
    .fill('')
    .map(() => (
      <Col key={Math.random()} xs={6} sm={4} lg={3} className={styles['product-item-wrapper']}>
        <ProductItemSkeleton />
      </Col>
    ))
