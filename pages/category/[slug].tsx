import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { InferGetServerSidePropsType } from 'next'
import { IProduct } from '@/models'
import { useQueryParams } from '@/hooks'
import { meta, routes } from '@/constants'
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
  const { slug } = context.query

  const { data: categoryResponse } = await $api.get(`/api/card/categoryid?id=${slug}`)
  const { data: nestingResponse } = await $api.get(`api/card/getnesting?id=${slug}`)

  let breadcrumbs = [{ _id: routes.CATEGORY, name: 'Каталог' }]

  if (nestingResponse.message?.length) {
    breadcrumbs = [
      ...breadcrumbs,
      ...nestingResponse.message.map((v: any) => ({ _id: `${routes.CATEGORY}/${v._id}`, name: v.name }))
    ]
  }

  return {
    props: {
      category: categoryResponse.message,
      nesting: categoryResponse.message.nesting || 0,
      breadcrumbs
    }
  }
}

const CategorySlugPage = ({
  category,
  nesting,
  breadcrumbs
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [products, setProductList] = useState<IProduct[]>([])
  const [countActiveFilterKeys, setCountActiveFilterKeys] = useState<number>(0)
  const {
    query,
    fullQuery: { joinProducts },
    setQuery,
    deleteQuery
  } = useQueryParams()

  const { data, isFetching } = useQuery({
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

      const { data: productsResponse } = await $api.get(`/api/products/category/${queryList.slug}?${queryParams}`)

      if (!hasChangesInFilters && Boolean(joinProducts)) {
        setProductList((prev) => [...prev, ...productsResponse.products])
      } else {
        setProductList(productsResponse.products)
      }

      return productsResponse
    },
    queryKey: [query, 'GET_PRODUCT_CATEGORY_ITEMS'],
    refetchOnWindowFocus: false,
    enabled: Boolean(query.sort || !nesting),
    retry: 1
  })

  return (
    <Layout meta={{ ...meta.CATEGORY_SLUG(category?.name) }}>
      <ItemListWithFilters
        title={category?.name}
        products={products}
        productTotalCount={data?.totalCount ?? 0}
        isLoading={isFetching}
        category={{ category }}
        nesting={nesting}
        filtersList={data?.filters ?? []}
        breadcrumbs={{ crumbs: breadcrumbs }}
        withCategoryFilterModule
        withWatchedProductsModule
      />
    </Layout>
  )
}

export default CategorySlugPage
