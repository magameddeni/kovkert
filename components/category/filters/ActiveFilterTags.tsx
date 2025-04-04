import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { IFilter } from '@/models'
import { useWindowSize, useQueryParams } from '@/hooks'
import { Icon, Text } from '@/components/UI'
import s from './filters.module.scss'

interface IActiveFilters {
  key: string
  title: string
  value: string
}

interface IActiveFilterTagsProps {
  className?: string
  filters: IFilter[]
  clearButton?: boolean
}

export const ActiveFilterTags = ({ className, filters, clearButton = true }: IActiveFilterTagsProps) => {
  const [activeFilters, setActiveFilters] = useState<IActiveFilters[]>([])
  const { query, setQuery, deleteQuery } = useQueryParams()
  const { slug, page, ...queryFilters } = query
  const { isLarge } = useWindowSize()

  const clearFilters = () => activeFilters.forEach((v: IActiveFilters) => deleteQuery(v.key))

  const removeFilter = async (key: string, value: string) => {
    const queryValueByKey: string | string[] | undefined = query?.[key]
    const stringQueryValueByKey: string | undefined = queryValueByKey ? String(queryValueByKey) : queryValueByKey

    if (!stringQueryValueByKey) return

    const currentQueryValue = stringQueryValueByKey
      .split(';and')
      .filter((v: string) => v !== value)
      .join(';and')

    if (!currentQueryValue || key === 'price_range') {
      return deleteQuery(key)
    }

    return setQuery({ [key]: currentQueryValue })
  }

  useEffect(() => {
    const currentActiveFilter: IActiveFilters[] = []

    filters.forEach((filter: IFilter) => {
      if (queryFilters[filter.key]) {
        const selectedValue = String(queryFilters[filter.key]).split(';and')

        if (filter.key === 'price_range') {
          return currentActiveFilter.push({
            key: filter.key,
            title: filter.title,
            value: `${selectedValue[0]} - ${selectedValue[1]}`
          })
        }

        return selectedValue.forEach((v: string) =>
          currentActiveFilter.push({ key: filter.key, title: filter.title, value: v })
        )
      }
    })

    setActiveFilters(currentActiveFilter)
  }, [query])

  if (!activeFilters.length) return null

  return (
    <div className={cx(s['active-filter-tags'], className)}>
      <div className={s['active-filter-tags__tag-list']}>
        {activeFilters.map((v: IActiveFilters) => (
          <div key={`${v.key}-${v.value}`} className={s.tag}>
            <Text as='p' size='sm' color='usual-gray' weight='light' whiteSpace='nowrap'>
              {v.title}
              <Text size='sm' color='white' weight='light'>
                {v.value}
              </Text>
            </Text>
            <Icon name='close' color='white' size='sm' onClick={() => removeFilter(v.key, v.value)} />
          </div>
        ))}
      </div>
      {activeFilters.length > (isLarge ? 3 : 2) && clearButton && (
        <div className={s['active-filter-tags__clear']}>
          <div className={s.tag} onClick={clearFilters}>
            {isLarge ? <Text>Сбросить все фильтры</Text> : <Icon name='close' size='md' />}
          </div>
        </div>
      )}
    </div>
  )
}
