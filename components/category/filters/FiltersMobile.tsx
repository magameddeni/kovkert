import React from 'react'
import { useRouter } from 'next/router'
import { IFilter } from '@/models'
import { useQueryParams } from '@/hooks'
import { productDeclension } from '@/helpers'
import { Button, Text } from '@/components/UI'
import { Filters } from './Filters'
import { ActiveFilterTags } from './ActiveFilterTags'
import s from './filters.module.scss'

interface IFiltersMobileProps {
  filters: IFilter[]
  productsCount: number
  onCompleteSelected: VoidFunction
}

export const FiltersMobile = ({ filters, productsCount, onCompleteSelected }: IFiltersMobileProps) => {
  const router = useRouter()
  const { deleteQuery } = useQueryParams()
  const { slug, page, ...queryFilters } = router.query
  const activeFilters = filters.filter((v: IFilter) => queryFilters[v.key])

  const clearFilters = () => activeFilters.forEach((v: IFilter) => deleteQuery(v.key))

  if (!filters.length) return null

  return (
    <div className={s['filters-mobile']}>
      <div className={s['filters-mobile__header']}>
        <Text as='p' className={s.title} align='center'>
          Фильтры
        </Text>
        {!!activeFilters?.length && (
          <Text size='xxs' color='blue' family='secondary' className={s['clear-filters']} onClick={clearFilters}>
            Очистить
          </Text>
        )}
      </div>
      <div className={s['filters-mobile__content']}>
        {!!activeFilters?.length && (
          <div className={s['filter-tags']}>
            <Text size='lg' family='secondary'>
              Выбраны
            </Text>
            <ActiveFilterTags className='offset-top-12' filters={filters} clearButton={false} />
          </div>
        )}
        <Filters filters={filters} />
      </div>
      <div className={s['filters-mobile__footer']}>
        <Button onClick={onCompleteSelected} fluid>
          Показать {productsCount} {productDeclension(productsCount)}
        </Button>
      </div>
    </div>
  )
}
