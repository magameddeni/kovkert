import React from 'react'
import Link from 'next/link'
import cx from 'classnames'
import { routes } from '@/constants'
import { TCategory, TSubCategory } from '@/models'
import { Text } from '@/components/UI'
import s from './category.module.scss'

interface ICategoryItemProps {
  category: TCategory
  mainCategories?: boolean
}

const CategoryItem = ({ category, mainCategories = false }: ICategoryItemProps) => (
  <div className={cx(s['category-item'], { [s['main-categories']]: mainCategories })}>
    <Link href={`${routes.CATEGORY}/${category._id}`}>
      <div className={s['category-item__block']}>
        <div className={s['category-title']}>
          <Text as='p' align='center' size='md' family='secondary' className={s.title}>
            {category.name}
          </Text>
        </div>
        <div className={s['category-img']}>
          <img src={category.img} alt='' />
        </div>
      </div>
    </Link>
    {mainCategories && (
      <div className={s['category-item__subcategories']}>
        <div className={s['subcategories-list']}>
          {'sub' in category &&
            category.sub?.length &&
            category.sub.map((v: TSubCategory | TCategory) => (
              <Link key={v._id} href={`${routes.CATEGORY}/${v._id}`} className={s.title}>
                <Text as='p' size='sm'>
                  {v.name}
                </Text>
              </Link>
            ))}
        </div>
      </div>
    )}
  </div>
)

export default CategoryItem
