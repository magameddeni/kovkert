import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { meta } from '@/constants'
import { useLazyGetUserQuery } from '@/redux/user/userApi'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { setSearchHistoryLocal } from '@/redux/user/userSlice'
import { useQueryParams } from '@/hooks'
import { IProduct } from '@/models'
import { ItemListWithFilters } from '@/components/category/ItemListWithFilters'
import {
  getActiveFiltersLength,
  getQueryWithoutCurrentKeys,
  replaceSeparatorInSearchParams,
  withLocationCoordsQuery
} from '@/components/category/utils'
import { baseQuery, notTriggerPageQueries } from '@/components/category/const'
import { SearchQuery } from '@/components/category/model'
import Layout from '@/components/layout/Main'
import $api from '@/components/Http/axios'

// Пустой getServerSideProps - это фикс бага Next, когда после перезагрузки страницы продают query params, которые пришли "извне"
export async function getServerSideProps() {
  return {
    props: {}
  }
}

const SearchPage = () => {
  const [products, setProductList] = useState<IProduct[]>([])
  const [countActiveFilterKeys, setCountActiveFilterKeys] = useState<number>(0)
  const {
    query,
    fullQuery: { joinProducts },
    deleteQuery,
    setQuery
  } = useQueryParams()
  const dispatch = useAppDispatch()

  const [getUserInfo] = useLazyGetUserQuery()
  const { isLoggedIn } = useAppSelector(({ beru }) => beru?.user)

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

      const { data: productResponse } = await $api.get(`/api/products?${queryParams}`)

      if (isLoggedIn) {
        await getUserInfo({ initial: false })
      } else {
        dispatch(setSearchHistoryLocal(query?.text as string))
      }

      if (!hasChangesInFilters && Boolean(joinProducts)) {
        setProductList((prev) => [...prev, ...productResponse?.products])
      } else {
        setProductList(productResponse?.products || [])
      }

      return productResponse
    },
    queryKey: [query, 'GET_SEARCH_ITEMS'],
    refetchOnWindowFocus: false,
    enabled: Boolean(query.sort && query.text)
  })

  return (
    <Layout meta={{ ...meta.SEARCH(query?.text as string) }} searchParams={{ value: query.text as string }}>
      <ItemListWithFilters
        title={(query.text as string) ?? ''}
        products={products}
        productTotalCount={data?.totalCount ?? 0}
        isLoading={isLoading}
        nesting={1}
        filtersList={data?.filters ?? []}
        withCategoryFilterModule
        withWatchedProductsModule
      />
    </Layout>
  )
}

export default SearchPage
