import { useMessage } from '@/hooks'
import { SearchQuery } from '@/components/category/model'
import { notQueryKeysForRequest } from '@/components/category/const'
import { SortType } from './sort/model'
import { sortList } from './sort/const'

export const getActiveFiltersLength = (filtersQuery: SearchQuery) =>
  Object.entries(filtersQuery).reduce((acc, [key, value]) => {
    const splitValue = (value as string).split(';and')

    if (key === 'price_range') {
      return acc + Number(splitValue[0]) + Number(splitValue[1])
    }

    if (key === 'sort') {
      return acc + sortList.findIndex((v) => v.value === value)
    }

    return acc + splitValue.length
  }, 0)

export const withLocationCoordsQuery = (query: SearchQuery) => {
  if (query.sort === SortType.LOCATION) {
    const lsCoords = localStorage.getItem('coords')

    if (lsCoords) {
      const coords: Record<string, string> = JSON.parse(lsCoords)

      return {
        ...query,
        coordinates: `${coords.latitude};and${coords.longitude}`
      }
    }

    useMessage('Геолокация не поддерживается. Сортировка по удаленности будет работать некорректно', 'info')
    return query
  }

  return query
}

export const replaceSeparatorInSearchParams = (query: SearchQuery) =>
  new URLSearchParams(query as unknown as string).toString().replace(/%3Band/g, '%3B')

export const getQueryWithoutCurrentKeys = (query: SearchQuery, keysTable = notQueryKeysForRequest) =>
  Object.fromEntries(Object.entries(query).filter((key) => !keysTable[key[0]]))
