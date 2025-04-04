import React from 'react'
import cx from 'classnames'
import { IProduct } from '@/models'
import { useWindowSize } from '@/hooks'
import { reviewsDeclension } from '@/helpers'
import { Icon, Text } from '@/components/UI'
import { AddToFavoritesButton } from '@/components/favorite'
import ShareButton from '@/components/ProductPage/ProductHeader/ShareButton'
import s from './product-header.module.scss'

interface IProductHeaderProps {
  product: IProduct
  rating: number | undefined
  numberReviews: number | undefined
  onReviews: VoidFunction
}

const ProductHeader: React.FC<IProductHeaderProps> = ({ product, rating, numberReviews, onReviews }) => {
  const { isSmall } = useWindowSize()

  return (
    <div className={s.header}>
      <div className={cx(s.header__block, s['rating-and-reviews'])}>
        <div className={s.rating}>
          <Icon size='md' name='star' color={rating ? 'orange' : 'gray'} />
          <Text className={s.rating__text} weight='regular' color={rating ? 'primary' : 'gray'}>
            {rating || 'Нет оценок'}
          </Text>
        </div>
        {numberReviews && (
          <Text as='p' decoration='underline' className={s.reviews} onClick={onReviews}>
            {numberReviews} {reviewsDeclension(numberReviews)}
          </Text>
        )}
      </div>
      <div className={cx(s.header__block, s['favorite-and-share'])}>
        {!isSmall && (
          <div className={cx(s.header__block, s['add-to-favorite'])}>
            <AddToFavoritesButton size='md' item={product} text='В избранном' />
          </div>
        )}
        <div className={s.header__block}>
          <ShareButton item={product} />
        </div>
      </div>
    </div>
  )
}

export default ProductHeader
