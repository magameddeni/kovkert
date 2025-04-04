import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { InferGetServerSidePropsType } from 'next'
import { IProduct } from '@/models'
import { useQueryParams } from '@/hooks'
import { ItemListWithFilters } from '@/components/category/ItemListWithFilters'
import { baseQuery, notTriggerPageQueries } from '@/components/category/const'
import {
  getActiveFiltersLength,
  getQueryWithoutCurrentKeys,
  replaceSeparatorInSearchParams,
  withLocationCoordsQuery
} from '@/components/category/utils'
import { SearchQuery } from '@/components/category/model'
import Layout from '@/components/layout/Main'
import $api from '@/components/Http/axios'

export const getServerSideProps = async (context: any) => {
  const { id } = context.query

  const { data: offerResponse } = await $api.get(`/api/offers/${id}`)
  const offerTitle = offerResponse?.data?.title

  return {
    props: {
      breadcrumbs: [{ _id: `/offer/${id}`, name: offerTitle }],
      offerTitle
    }
  }
}

const OfferIdPage = ({ breadcrumbs, offerTitle }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [products, setProductList] = useState<IProduct[]>([])
  const [countActiveFilterKeys, setCountActiveFilterKeys] = useState<number>(0)

  const {
    query,
    setQuery,
    deleteQuery,
    fullQuery: { joinProducts }
  } = useQueryParams()

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

      const { data: productsResponse } = await $api.get(`/api/products/offers/${query.id}?${queryParams}`)

      if (!hasChangesInFilters && Boolean(joinProducts)) {
        setProductList((prev) => [...prev, ...productsResponse.products])
      } else {
        setProductList(productsResponse.products)
      }

      return productsResponse
    },
    queryKey: [query, 'GET_OFFERS_ITEMS'],
    refetchOnWindowFocus: false,
    enabled: Boolean(query.sort),
    retry: 1
  })

  return (
    <Layout meta={{ title: offerTitle }}>
      <ItemListWithFilters
        title={offerTitle}
        products={products}
        productTotalCount={data?.totalCount ?? 0}
        isLoading={isLoading}
        nesting={1}
        filtersList={data?.filters ?? []}
        breadcrumbs={{ crumbs: breadcrumbs }}
        withWatchedProductsModule
      />
    </Layout>
  )
}

export default OfferIdPage
