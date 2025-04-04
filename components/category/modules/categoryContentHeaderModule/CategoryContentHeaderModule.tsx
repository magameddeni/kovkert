import React, { FC } from 'react'
import cx from 'classnames'
import { ProductsViews, ProductsViewToggle } from '@/components/product'
import { Sort, ActiveFilterTags } from '@/components/category'
import { Icon, Text } from '@/components/UI'
import { useWindowSize } from '@/hooks'
import { IFilter } from '@/models'
import styles from './category-content-header.module.scss'

interface CategoryContentHeaderModuleProps {
  activeProductsView?: ProductsViews
  onMobileFilterClick: VoidFunction
  filtersList: IFilter[]
  classname?: string
}

export const CategoryContentHeaderModule: FC<CategoryContentHeaderModuleProps> = ({
  activeProductsView,
  onMobileFilterClick,
  filtersList,
  classname
}) => {
  const { isLarge } = useWindowSize()

  return (
    <>
      <div className={cx(styles['sort-and-view'], classname)}>
        <Sort />
        {isLarge && <ProductsViewToggle initialActive={activeProductsView} />}
        {!isLarge && (
          <div className={styles['filters-mobile']} onClick={onMobileFilterClick}>
            <Icon name='settings' />
            <Text>Фильтры</Text>
          </div>
        )}
      </div>
      <ActiveFilterTags className='offset-top-4 offset-lg-top-16' filters={filtersList} />
    </>
  )
}
