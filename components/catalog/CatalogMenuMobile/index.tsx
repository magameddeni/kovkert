import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/router'
import classNames from 'classnames/bind'
import { routes } from '@/constants'
import { TCategory, TSubCategory } from '@/models'
import { Icon, If, Text } from '@/components/UI'
import CatalogMenuSkeleton from '@/components/catalog/CatalogMenuSkeleton'
import $api from '@/components/Http/axios'
import styles from './styles.module.scss'

const cn = classNames.bind(styles)

interface CatalogMenuMobileProps {
  onClose: VoidFunction
  onCategoryClick?: (id: string, name: string) => void
  mainCategories?: TCategory[]
  shopId?: string
  asLink?: boolean
}

const hasParentCategory = (activeCategory: TCategory | TSubCategory | null, item: TCategory | TSubCategory) =>
  (activeCategory as TCategory)?.sub?.some((e) => e._id === item._id) ||
  activeCategory?.categories?.some((e) => e._id === item._id)

const CatalogMenuMobile = ({
  onClose,
  onCategoryClick,
  mainCategories,
  shopId = '',
  asLink = true
}: CatalogMenuMobileProps) => {
  const [activeCategory, setActiveCategory] = useState<TCategory | TSubCategory | null>(null)
  const [categories, setCategories] = useState<TSubCategory[][]>([])
  const [catalog, setCatalog] = useState<TCategory[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const onSelectCorrectCategory = (id: string, name: string) => {
    if (!asLink) {
      onClose()
      return typeof onCategoryClick === 'function' && onCategoryClick(id, name)
    }

    return router.push(`${routes.CATEGORY}/${id}`).then(onClose)
  }

  const fetchMainCategories = () => {
    setIsLoading(true)

    return $api.get('/api/categories').then((res) => {
      setCatalog(res.data.categories)
      setCategories([])
      setActiveCategory(null)
    })
  }

  const fetchCategories = async (item: TCategory | TSubCategory) => {
    if (isLoading) return

    if (item.haSubcategories) {
      setIsLoading(true)

      const getCurrentUrl = () => {
        if (shopId) return `/api/categories/shop/${shopId}/parent/${item._id}`
        return `/api/categories/parent/${item._id}`
      }

      const categoriesResponse = await $api.get(getCurrentUrl())

      if (activeCategory && hasParentCategory(activeCategory, item)) {
        item.parent = activeCategory
      }
      setActiveCategory(item)
      setCategories(shopId ? categoriesResponse.data.categories : categoriesResponse.data.message)
      setIsLoading(false)
    } else {
      onSelectCorrectCategory(item._id, item.name)
    }
  }

  const handleClickPrev = () => {
    if (!activeCategory?.parent?._id) {
      setActiveCategory(null)
      setCategories([])
    } else {
      fetchCategories(activeCategory?.parent)
    }
  }

  const renderCategories = () => {
    let items: TSubCategory[] | TCategory[] | undefined | null = catalog

    if (categories?.length) {
      items = categories?.reduce((acc, current) => {
        current.forEach((item) => {
          acc.push(item)
        })
        return acc
      }, [])
    }

    if (isLoading) {
      return <CatalogMenuSkeleton />
    }

    if (!items?.length) {
      return <div>Данных нет</div>
    }

    return (
      <ul className={styles.container__list}>
        {Boolean(activeCategory?._id) && (
          <li
            className={cn({ container__item: true })}
            onClick={() => onSelectCorrectCategory(activeCategory?._id as string, activeCategory?.name as string)}
          >
            Все товары из категории
          </li>
        )}
        {items?.map((item: TSubCategory | TCategory) => (
          <li key={item._id} className={styles.container__item} onClick={() => fetchCategories(item)}>
            <Text weight='regular' className={styles.container__left_col}>
              {'icon' in item && <Icon name={`category-${item.icon}`} size='xxl' />}
              {item.name}
            </Text>
            {(item.haSubcategories || !activeCategory) && <Icon name='arrow-right' size='sm' color='gray' />}
          </li>
        ))}
      </ul>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      if (shopId && mainCategories?.length) {
        setCatalog(mainCategories)
        setCategories([])
      } else {
        await fetchMainCategories()
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  return createPortal(
    <div className={styles.container}>
      <div className={styles.container__header}>
        <If condition={!!categories.length}>
          <button aria-label='назад' className={styles.container__back_btn} onClick={handleClickPrev}>
            <Icon name='arrow-left2' />
          </button>
        </If>
        <Text size='lg' align='center' family='secondary'>
          {activeCategory?.name || 'Каталог'}
        </Text>
        <button aria-label='Закрыть каталог' className={styles.container__close_btn} onClick={onClose}>
          <Icon color='gray' size='md' name='close' />
        </button>
      </div>
      <div className={styles.container__inner}>{renderCategories()}</div>
    </div>,
    document.getElementById('__next') as any
  )
}

export default CatalogMenuMobile
