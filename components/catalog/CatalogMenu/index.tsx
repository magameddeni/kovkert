import React, { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { routes } from '@/constants'
import { TCategory, TSubCategory } from '@/models'
import { Button, Icon, Text } from '@/components/UI'
import $api from '@/components/Http/axios'
import CatalogMenuSkeleton from '../CatalogMenuSkeleton'
import styles from './styles.module.scss'

const COLLAPSED_COUNT = 6

interface CategoryProp {
  categories: TCategory[] | undefined
}

const categoryFetcher = (url: string) => $api.get(url).then((res) => res.data.categories)
const subcategoryFetcher = (url: string) => $api.get(url).then((res) => res.data.message)

const Category = ({ categories }: CategoryProp) => {
  const [collapsed, setCollapsed] = useState(true)

  const renderCategories = () => {
    let items = categories

    if (!items) return null

    if (collapsed) {
      items = items.slice(0, COLLAPSED_COUNT)
    }

    return items.map((item) => (
      <li key={item._id}>
        <Link href={`${routes.CATEGORY}/${item._id}`}>
          <span className={styles.subcategory__list_link}>{item.name}</span>
        </Link>
      </li>
    ))
  }

  if (!categories) return null

  return (
    <>
      <ul className={styles.subcategory__list}>{renderCategories()}</ul>
      {categories.length > COLLAPSED_COUNT && (
        <Button
          className={styles.catalog__show_more_btn}
          onClick={() => setCollapsed(!collapsed)}
          iconRight={collapsed ? 'arrow-bottom' : 'arrow-top'}
          iconOptions={{ size: 'xs', color: 'blue' }}
          view='link'
        >
          {collapsed ? 'Показать еще' : 'Скрыть'}
        </Button>
      )}
    </>
  )
}

const CatalogMenu = () => {
  const [activeCategory, setActiveCategory] = useState<TCategory | null>(null)
  const { data: catalog } = useSWR<TCategory[]>('/api/categories', categoryFetcher, {
    revalidateIfStale: false
  })
  const { data: categories } = useSWR<TSubCategory[][]>(
    `/api/categories/parent/${activeCategory?._id}`,
    subcategoryFetcher
  )

  const renderCategories = () =>
    catalog?.map((category) => (
      <li key={category._id} onMouseEnter={() => setActiveCategory(category)}>
        <Link className={styles.catalog__list_link} href={`${routes.CATEGORY}/${category._id}`}>
          <span className={styles.catalog__column}>
            <Icon name={`category-${category.icon}`} size='xxl' />
            <span>{category.name}</span>
          </span>
          <Icon name='arrow-right' className={styles['arrow-icon']} size='xs' />
        </Link>
      </li>
    ))

  const renderSubCategories = () =>
    categories?.map((category: TSubCategory[]) => (
      <div key={Math.random()} className={styles.subcategory__column}>
        {category?.map((item) => (
          <div className={styles.subcategory__item} key={item._id}>
            <Link href={`${routes.CATEGORY}/${item._id}`}>
              <span className={styles.subcategory__name}>{item.name}</span>
            </Link>
            {Boolean(item?.categories?.length) && <Category categories={item?.categories} />}
          </div>
        ))}
      </div>
    ))

  return (
    <div className={styles.catalog}>
      <div className={styles.container}>
        <div className={styles.catalog__inner}>
          <div className={styles.catalog__left}>
            {!catalog ? <CatalogMenuSkeleton /> : <ul className={styles.catalog__list}>{renderCategories()}</ul>}
          </div>
          <div className={styles.catalog__right}>
            <div className={styles.catalog__right_inner}>
              <div className={styles.subcategory}>
                <Text as='h3'>{activeCategory?.name}</Text>
                <div className={styles.subcategory__columns}>{renderSubCategories()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogMenu
