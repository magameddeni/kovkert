import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { meta } from '@/constants'
import { IFilter, IProduct } from '@/models'
import { useQueryParams } from '@/hooks'
import { ItemListWithFilters } from '@/components/category/ItemListWithFilters'
import { SearchQuery } from '@/components/category/model'
import { baseQuery, notTriggerPageQueries } from '@/components/category/const'
import {
  getActiveFiltersLength,
  getQueryWithoutCurrentKeys,
  replaceSeparatorInSearchParams,
  withLocationCoordsQuery
} from '@/components/category/utils'
import { DotsLoader } from '@/components/UI'
import Layout from '@/components/layout/Main'
import $api from '@/components/Http/axios'

const BrandPage = () => {
  const [products, setProductList] = useState<IProduct[]>([])
  const [filters, setFilters] = useState<IFilter[]>([])
  const [countActiveFilterKeys, setCountActiveFilterKeys] = useState<number>(0)

  const {
    query,
    fullQuery: { joinProducts },
    setQuery,
    deleteQuery
  } = useQueryParams()
  const brandName = (query?.slug ?? '') as string

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const queryList: SearchQuery = { ...query, ...baseQuery }

      const queryParams = replaceSeparatorInSearchParams(withLocationCoordsQuery(getQueryWithoutCurrentKeys(queryList)))
      const filtersQuery = Object.fromEntries(Object.entries(queryList).filter((key) => !notTriggerPageQueries[key[0]]))
      const activeFiltersLength = getActiveFiltersLength(filtersQuery)
      const hasChangesInFilters = activeFiltersLength !== countActiveFilterKeys

      if (hasChangesInFilters && Boolean(joinProducts)) {
        await deleteQuery('joinProducts')
      }

      setCountActiveFilterKeys(activeFiltersLength)

      if (hasChangesInFilters && queryList?.page !== '1') {
        return setQuery({ page: '1' })
      }

      const { data: productsResponse } = await $api.get(`/api/products?brand=${brandName}&${queryParams}`)

      if (!hasChangesInFilters && Boolean(joinProducts)) {
        setProductList((prev) => [...prev, ...productsResponse.products])
      } else {
        setProductList(productsResponse.products)
      }

      setFilters(
        productsResponse.filters?.length ? productsResponse.filters.filter((v: IFilter) => v.key !== 'brand') : []
      )

      return productsResponse
    },
    queryKey: ['GET_BRAND_ITEMS', query],
    refetchOnWindowFocus: false,
    enabled: Boolean(query.sort && brandName)
  })

  return (
    <Layout meta={{ ...meta.BRAND_SLUG(brandName) }}>
      {brandName ? (
        <ItemListWithFilters
          title={brandName}
          products={products}
          productTotalCount={data?.totalCount ?? 0}
          isLoading={isLoading}
          nesting={1}
          filtersList={filters}
        />
      ) : (
        <DotsLoader center />
      )}
    </Layout>
  )
}

export default BrandPage
