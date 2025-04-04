import React from 'react'
import cx from 'classnames'
import { routes } from '@/constants'
import { useRouter } from 'next/router'
import { TOfferCategoriesList } from '@/models'
import { Text } from '@/components/UI'
import s from './style.module.scss'

const CategoriesOffer: React.FC<TOfferCategoriesList> = ({ categories, category, image }) => {
  const { push } = useRouter()

  return (
    <div className={s.wrapper}>
      <div className={s.wrapper__categories}>
        <Text
          cursor='pointer'
          onClick={() => push(`${routes.CATEGORY}/${category._id}`)}
          className={s['wrapper__categories-title']}
          weight='medium'
        >
          {category.title}
        </Text>
        <div className='offset-top-16'>
          {categories.map((item) => (
            <Text
              key={item._id}
              cursor='pointer'
              onClick={() => push(`${routes.CATEGORY}/${item._id}`)}
              className={cx('offset-top-8', s.wrapper__category)}
              weight='regular'
              as='div'
            >
              {item.title}
            </Text>
          ))}
        </div>
      </div>
      <div className={s.wrapper__image_wrapper}>
        <img className={s.wrapper__image} alt='' src={image.link} />
      </div>
    </div>
  )
}

export default CategoriesOffer
