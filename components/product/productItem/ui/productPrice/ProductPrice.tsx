import React, { useMemo } from 'react'
import cx from 'classnames'
import { setSpaceBetweenCharacters } from '@/helpers'
import { ISize } from '@/models'
import { Text } from '@/components/UI'
import styles from './product-price.module.scss'

interface ProductPriceProps {
  discountPrice: number
  regularPrice?: number | undefined
  withSuffix?: boolean
  view?: 'primary' | 'secondary'
  classNameWrapper?: string
  discountPriceSize?: ISize['size']
  regularPriceSize?: ISize['size']
}

export const ProductPrice = ({
  discountPrice,
  regularPrice,
  withSuffix = false,
  view = 'primary',
  classNameWrapper,
  discountPriceSize = 'xl',
  regularPriceSize = 'xs'
}: ProductPriceProps) => {
  const primaryView = useMemo(() => view === 'primary', [view])

  return (
    <div className={cx(styles['product-price'], { [styles[`view-${view}`]]: view }, classNameWrapper)}>
      <Text
        as='p'
        className={cx(styles['product-price__discount'], { [styles['with-regular-price']]: regularPrice })}
        size={discountPriceSize}
        family={primaryView ? 'secondary' : 'primary'}
      >
        {setSpaceBetweenCharacters(discountPrice)} ₽
        {Boolean(regularPrice) && (
          <Text
            className={styles['product-price__regular']}
            color={primaryView ? 'gray' : 'primary'}
            family='primary'
            decoration='line-through'
            size={regularPriceSize}
          >
            {setSpaceBetweenCharacters(regularPrice)} ₽
          </Text>
        )}
        {withSuffix && (
          <Text color='gray' size='xxs' style={{ marginLeft: 5 }}>
            за шт.
          </Text>
        )}
      </Text>
    </div>
  )
}
