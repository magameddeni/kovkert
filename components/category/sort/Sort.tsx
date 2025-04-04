import React, { useLayoutEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize, useQueryParams } from '@/hooks'
import { Icon, Select, Text, ISelectOption } from '@/components/UI'
import { data2Select } from '@/components/UI/select/utils'
import { SortType } from './model'
import { sortList } from './const'
import s from './sort.module.scss'

export const Sort = React.memo(() => {
  const [sort, setSort] = useState<ISelectOption<SortType>>()
  const { isLarge } = useWindowSize()
  const { setQuery } = useQueryParams()
  const { query } = useRouter()

  const hasLsCoords = useMemo(() => Boolean(localStorage.getItem('coords')), [localStorage.getItem('coords')])

  const findCurrentSortingLabel = (sortValue: SortType) =>
    sortList.find((v) => v.value === sortValue)?.label ?? sortList[0].label

  const setSortingValue = (data: ISelectOption<SortType>) => {
    setSort(data)
    setTimeout(() => void setQuery({ sort: data.value, page: '1' }), 10)
  }

  useLayoutEffect(() => {
    if (!query?.sort) {
      return setSortingValue(
        hasLsCoords ? (sortList.find((v) => v.value === SortType.LOCATION) as ISelectOption<SortType>) : sortList[1]
      )
    }

    setSortingValue(data2Select(query.sort as SortType, findCurrentSortingLabel(query.sort as SortType)))
  }, [query?.slug, query.text])

  if (!sort?.value) return null

  return (
    <div className={s.sort}>
      {isLarge ? (
        <Text className={s.sort__title}>Сортировка:</Text>
      ) : (
        <Icon className={s.sort__icon} size='md' name='sort' />
      )}
      <Select
        name='sort'
        view='light'
        value={sort}
        onChange={setSortingValue}
        options={sortList}
        styleControl={{ width: '200px' }}
      />
    </div>
  )
})
