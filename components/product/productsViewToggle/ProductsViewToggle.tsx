import React, { FC, memo, useState } from 'react'
import { useQueryParams } from '@/hooks'
import { Icon } from '@/components/UI'
import s from './products-view-toggle.module.scss'

interface ProductsViewToggleProps {
  initialActive?: ProductsViews | undefined
}

export type ProductsViews = 'grid' | 'list'

export const ProductsViewToggle: FC<ProductsViewToggleProps> = memo(({ initialActive }) => {
  const {
    query: { view: queryView },
    setQuery
  } = useQueryParams()
  const [view, setView] = useState(initialActive || queryView || 'grid')
  const views: ProductsViews[] = ['grid', 'list']

  const handleViewChange = (data: ProductsViews) => {
    setView(data)
    void setQuery({ view: data })
  }

  return (
    <div className={s['products-view-handler']}>
      {views.map((v: ProductsViews) => (
        <Icon
          key={v}
          name={`view-${v}`}
          className={s['products-view-handler__icon']}
          size='md'
          color={view === v ? 'primary' : 'gray'}
          onClick={() => handleViewChange(v)}
        />
      ))}
    </div>
  )
})
