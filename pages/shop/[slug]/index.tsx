import React, { useEffect, useMemo, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { useQuery } from '@tanstack/react-query'
import { meta, routes } from '@/constants'
import { setSearchHistoryLocal } from '@/redux/user/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { useLazyGetUserQuery } from '@/redux/user/userApi'
import { IProduct, TCategory } from '@/models'
import { scrollToTop } from '@/helpers'
import { useQueryParams, useWindowSize } from '@/hooks'
import { Button, CrumbElement, Text } from '@/components/UI'
import { SearchMobile } from '@/components/search'
import { ILayoutSearchParams } from '@/components/layout/models'
import { AffiliateButton, ShopHeader } from '@/components/shopPage'
import { ItemListWithFilters } from '@/components/category/ItemListWithFilters'
import { SearchQuery } from '@/components/category/model'
import { baseQuery, notTriggerPageQueries } from '@/components/category/const'
import {
  getActiveFiltersLength,
  getQueryWithoutCurrentKeys,
  replaceSeparatorInSearchParams,
  withLocationCoordsQuery
} from '@/components/category/utils'
import Layout from '@/components/layout/Main'
import CatalogMenuMobile from '@/components/catalog/CatalogMenuMobile'
import $api from '@/components/Http/axios'
import s from './shop-page.module.scss'

export const getServerSideProps = async (context: any) => {
  const { slug } = context.query
  const { data: shopResponse } = await $api.get(`/api/shop/${slug}`)

  const shopInfo = shopResponse?.shop?.[0]

  const { data: mainCategoriesResponse } = await $api.get(`/api/categories/shop/${shopInfo._id}`)

  const breadcrumbs = [{ _id: `${routes.SHOP}/${slug}`, name: shopInfo?.name }]

  return {
    props: {
      shop: shopInfo,
      mainCategories: mainCategoriesResponse?.categories,
      breadcrumbs
    }
  }
}

const ShopPage = ({ shop, mainCategories, breadcrumbs }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [products, setProducts] = useState<IProduct[] | []>([])
  const [countActiveFilterKeys, setCountActiveFilterKeys] = useState<number>(0)
  const [dynamicBreadcrumbs, setDynamicBreadcrumbs] = useState<CrumbElement[] | []>([])
  const [isShowCatalog, setIsShowCatalog] = useState<boolean>(false)
  const { isLarge } = useWindowSize()
  const {
    query,
    setQuery,
    deleteQuery,
    fullQuery: { joinProducts, categoryName }
  } = useQueryParams()
  const dispatch = useAppDispatch()

  const { isLoggedIn } = useAppSelector(({ beru }) => beru?.user)
  const [getUserInfo] = useLazyGetUserQuery()

  const crumbs = useMemo(() => [...breadcrumbs, ...dynamicBreadcrumbs], [dynamicBreadcrumbs])
  const nesting = useMemo(() => Number(Boolean(query?.category)), [query?.category])

  useQuery<TCategory>({
    queryFn: async () => {
      if (query?.category) {
        const { data, status } = await $api.get(`api/card/getnesting?id=${query.category}`)
        if (status !== 200) throw new Error('Ошибка получения данных!')
        setDynamicBreadcrumbs(
          data.message.map((v: any) => ({
            _id: `${routes.SHOP}/${shop.slug}?category=${v._id}&categoryName=${v.name}`,
            name: v.name
          }))
        )
        return data.message
      }
    },
    queryKey: ['FETCH_NESTING_CATEGORIES', query?.category],
    refetchOnWindowFocus: false,
    enabled: Boolean(query?.category)
  })

  const { data: productData, isFetching: isProductsLoading } = useQuery({
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

      const { data } = await $api.get(
        `/api/products/shop/${shop._id}${query?.category ? `/category/${query.category}` : ''}?${queryParams}`
      )

      if (!hasChangesInFilters && Boolean(joinProducts)) {
        setProducts((prev) => [...prev, ...data.products])
      } else {
        setProducts(data.products)
      }

      return data
    },
    queryKey: ['SHOP_PRODUCTS', shop._id, query],
    refetchOnWindowFocus: false
  })

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery<TCategory>({
    queryFn: async () => {
      const { data, status } = await $api.get(
        `/api/categories/shop/${shop._id}${query?.category ? `/parent/${query.category}` : ''}`
      )
      if (status !== 200) throw new Error('Ошибка получения данных!')
      return data?.categories?.flat()
    },
    queryKey: ['SHOP_CATEGORIES', shop._id, query?.category],
    refetchOnWindowFocus: false
  })

  const handleClose = () => setIsShowCatalog(false)

  const onClearSearch = () => {
    deleteQuery('text')
    if (query.page !== '1') void setQuery({ page: '1' })
  }

  const getSearchData = async (searchData: string) => {
    await setQuery({ text: searchData, page: '1' })

    if (isLoggedIn) {
      await getUserInfo({ initial: false })
    } else {
      dispatch(setSearchHistoryLocal(searchData))
    }
  }

  const onCategoryHandler = async (id?: string, name?: string) => {
    if (!id || !name) {
      setDynamicBreadcrumbs([])
      deleteQuery('category')
      return deleteQuery('categoryName')
    }

    await setQuery({ category: id, categoryName: name, page: '1' })

    scrollToTop()
  }

  const searchParamsProps: ILayoutSearchParams = {
    value: query?.text as string,
    placeholder: 'Поиск по магазину',
    type: 'shop',
    searchPrefix: shop.name,
    getSearchData,
    onClearSearch
  }

  useEffect(() => {
    if (!query?.category && dynamicBreadcrumbs?.length) {
      setDynamicBreadcrumbs([])
    }

    if (query?.category) deleteQuery('text')
  }, [query?.category])

  return (
    <Layout
      meta={{ ...meta.SHOP(shop?.name) }}
      hasSearch={isLarge}
      hasTopHeader={isLarge}
      searchParams={searchParamsProps}
      buttonBack
    >
      <ItemListWithFilters
        title={nesting ? (categoryName as string) : ''}
        products={products}
        productTotalCount={productData?.totalCount ?? 0}
        isLoading={isProductsLoading || isCategoriesLoading}
        category={{
          category: categoriesResponse as TCategory,
          onCategoryClick: onCategoryHandler,
          asLink: false,
          subKey: query?.category ? 'categories' : 'sub',
          children: isLarge ? <AffiliateButton /> : null
        }}
        nesting={nesting}
        filtersList={productData?.filters ?? []}
        breadcrumbs={{ crumbs: isLarge ? crumbs : [], withIndexPageCrumb: false }}
        subTitle={
          <div className={s['page-subtitle']}>
            <Text as='h2'>{query?.text ?? 'Все товары'}</Text>
            {!isLarge && <AffiliateButton className={s['page-subtitle__aff-button']} />}
          </div>
        }
        withCategoryFilterModule
      >
        <ShopHeader shop={shop} onShopName={onCategoryHandler} />
        {!isLarge && (
          <div className={s['shop-search-and-catalog']}>
            <SearchMobile {...searchParamsProps} />
            <Button
              className='offset-top-12 offset-sm-top-16'
              view='secondary'
              onClick={() => setIsShowCatalog(true)}
              fluid
            >
              Каталог магазина
            </Button>
          </div>
        )}
      </ItemListWithFilters>

      {isShowCatalog && (
        <CatalogMenuMobile
          onClose={handleClose}
          onCategoryClick={onCategoryHandler}
          mainCategories={mainCategories}
          shopId={shop._id}
          asLink={false}
        />
      )}
    </Layout>
  )
}

export default ShopPage
