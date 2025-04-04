import React from 'react'
import { Text } from '@/components/UI'
import styles from './affiliate-discount-percentage.module.scss'

interface AffiliateDiscountPercentageProps {
  discount: number
  className?: string
}

export const AffiliateDiscountPercentage = ({ discount, className }: AffiliateDiscountPercentageProps) => (
  <div className={styles['affiliate-discount-percentage']}>
    <img src='/hexagon-shadow.svg' alt='' />
    <Text color='peach' size='xs' family='secondary' className={className}>
      Скидка {discount}%
    </Text>
  </div>
)
