import React from 'react'
import cx from 'classnames'
import { Text } from '@/components/UI'
import styles from './product-name.module.scss'

interface AffiliateProductNameProps {
  name: string
  className?: string
}

export const ProductName = ({ name, className }: AffiliateProductNameProps) => (
  <Text size='md' className={cx(styles['product-name'], className)}>
    {name}
  </Text>
)
