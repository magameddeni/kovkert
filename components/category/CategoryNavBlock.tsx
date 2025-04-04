import React, { useState } from 'react'
import cx from 'classnames'
import { TCategory } from '@/models'
import { useWindowSize } from '@/hooks'
import { Button, Icon, Text } from '@/components/UI'
import { useRouter } from 'next/router'
import s from './category.module.scss'

interface ICategoryNavBlockProps {
  categories: TCategory | undefined
  hasChildCategories: boolean
  onCategoryClick?: ((id: string, name: string) => void) | undefined
  asLink?: boolean | string | undefined
  subKey?: 'sub' | 'categories' | undefined
}

const CategoryNavBlock = ({
  categories,
  hasChildCategories,
  onCategoryClick,
  asLink,
  subKey = 'sub'
}: ICategoryNavBlockProps) => {
  const [isShowMore, setIsShowMore] = useState<boolean>(false)
  const { deviceWidth } = useWindowSize()
  const router = useRouter()

  const categoryItemContent = ({ name, main = true }: { name: string; main?: boolean }) => (
    <>
      <Text
        size='md'
        cursor='pointer'
        color={hasChildCategories ? 'primary' : 'gray'}
        family={main ? 'secondary' : 'primary'}
      >
        {name}
      </Text>
      {deviceWidth !== 'large' && <Icon name='arrow-right' color='gray' size='sm' />}
    </>
  )

  const CategoryItem = ({ id, name }: { id: string; name: string }) => {
    if (!id) return null

    return (
      <li className={s['subcategory-item']}>
        <div
          onClick={() =>
            asLink
              ? router.replace({ query: { slug: id, sort: router.query?.sort ?? '' } })
              : onCategoryClick
                ? onCategoryClick(id, name)
                : {}
          }
          className={s['category-link']}
        >
          {categoryItemContent({ name, main: false })}
        </div>
      </li>
    )
  }

  if (!categories || !categories?.[subKey]) return null

  return (
    <div className={cx(s['category-nav-block'], { [s['without-child-categories']]: !hasChildCategories })}>
      <div
        className={s['category-link']}
        onClick={() =>
          asLink
            ? router.replace({ query: { slug: categories._id, sort: router.query?.sort ?? '' } })
            : onCategoryClick
              ? onCategoryClick(categories._id, categories.name)
              : {}
        }
      >
        {categoryItemContent({ name: categories.name as string })}
      </div>
      {!!categories?.[subKey]?.length && (
        <ul className='offset-top-12'>
          {/* @ts-ignore */}
          {categories?.[subKey].map((v: TCategory | string, i: number) => {
            if (typeof v === 'object') {
              if (!isShowMore) {
                if (i < 5) return <CategoryItem key={v._id} id={v._id} name={v.name} />
                return
              }

              return <CategoryItem key={v._id} id={v._id} name={v.name} />
            }
          })}
        </ul>
      )}
      {/* @ts-ignore */}
      {categories?.[subKey]?.length > 5 && (
        <Button
          className='offset-top-12'
          onClick={() => setIsShowMore(!isShowMore)}
          iconRight={!isShowMore ? 'arrow-bottom' : 'arrow-top'}
          iconOptions={{ size: 'xs', color: 'blue' }}
          view='link'
        >
          {!isShowMore ? 'Показать еще' : 'Скрыть'}
        </Button>
      )}
    </div>
  )
}

export default CategoryNavBlock
