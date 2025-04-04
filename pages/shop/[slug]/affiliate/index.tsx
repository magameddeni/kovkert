import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { InferGetServerSidePropsType } from 'next'
import { meta, routes } from '@/constants'
import { useQueryParams, useWindowSize } from '@/hooks'
import { ProductAffiliate } from '@/models/affiliate'
import { scrollToTop } from '@/helpers'
import { Breadcrumbs, Col, Container, EmptyPage, Pagination, Row, Text } from '@/components/UI'
import { ShopHeader } from '@/components/shopPage'
import { ProductItemSkeleton } from '@/components/product'
import { ProductItemAffiliate, AffiliateInfoBlock } from '@/components/affiliate'
import { LIMIT_ITEMS_ON_PAGE } from '@/components/category/const'
import { getQueryWithoutCurrentKeys } from '@/components/category/utils'
import { useGetConnectedProducts } from '@/components/profile/ProfilePartner'
import { getConnectedProductIds } from '@/components/affiliate/utils/getConnectedProductIds'
import Layout from '@/components/layout/Main'
import $api from '@/components/Http/axios'
import styles from './shop-affiliate-page.module.scss'

export const getServerSideProps = async (context: any) => {
  const { slug } = context.query
  const { data: shopResponse } = await $api.get(`/api/shop/${slug}`)

  const shopInfo = shopResponse?.shop?.[0]

  const breadcrumbs = [
    { _id: `${routes.SHOP}/${slug}`, name: shopInfo?.name },
    { _id: `${routes.SHOP}/${slug}${routes.AFFILIATE}`, name: 'Партнерская программа' }
  ]

  return {
    props: {
      shop: shopInfo,
      breadcrumbs
    }
  }
}

const ShopAffiliatePage = ({ shop, breadcrumbs }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [totalCount, setTotalCount] = useState(0)
  const [connectedProductIds, setConnectedProductIds] = useState<Record<string, boolean>>({})
  const { isLarge } = useWindowSize()
  const { setQuery } = useQueryParams()
  const { query } = useRouter()

  const productsRef = useRef<HTMLDivElement | null>(null)

  const { programs = [], refetch } = useGetConnectedProducts({
    initQuery: {
      filter: 'active'
    }
  })

  const { data: affiliateItems, isLoading } = useQuery({
    queryFn: async () => {
      const queryParams = getQueryWithoutCurrentKeys(query)

      const response = await $api.get(
        `/api/affiliate/programs/shopId/${shop._id}?filter=active&${new URLSearchParams(queryParams as unknown as string).toString()}`
      )
      setTotalCount(response.data.totalCount)
      return response?.data?.programs
    },
    queryKey: ['GET_AFFILIATE_ITEMS', query],
    refetchOnWindowFocus: false,
    retry: 1
  })

  const onPaginationChange = async (value: number) => {
    scrollToTop(
      !isLarge && productsRef?.current ? window.scrollY + productsRef?.current?.getBoundingClientRect().top - 50 : 0
    )

    await setQuery({ page: String(value) })
  }

  const renderSkeletons = () =>
    Array(4)
      .fill('')
      .map(() => (
        <Col key={Math.random()} xs={6} sm={4} md={3} lg={4} xl={3} className={styles['product-item-wrapper']}>
          <ProductItemSkeleton />
        </Col>
      ))

  useEffect(() => {
    if (programs.length) {
      setConnectedProductIds(getConnectedProductIds(programs, 'programId'))
    }
  }, [programs])

  return (
    <Layout meta={{ ...meta.SHOP_AFFILIATE(shop?.name) }} hasSearch={isLarge} hasTopHeader={isLarge} buttonBack>
      <Container className={styles['shop-affiliate']}>
        <ShopHeader shop={shop} />
        <div className='offset-top-24'>
          <Breadcrumbs crumbs={breadcrumbs} withIndexPageCrumb={false} />
        </div>
        <div className={cx(styles['shop-affiliate__title'], 'offset-top-24')}>
          <Text as='h1' color='peach'>
            Партнерская программа
          </Text>
          {!isLarge && <AffiliateInfoBlock asIcon />}
        </div>
        <Row className='offset-top-20 offset-sm-top-24 offset-lg-top-32' row={32}>
          <Col className={styles['shop-affiliate__nav']}>
            <AffiliateInfoBlock />
          </Col>
          <Col className={styles['shop-affiliate__content']}>
            <div ref={productsRef}>
              <Row row={!isLarge ? 16 : 20} small={!isLarge}>
                {affiliateItems?.length
                  ? affiliateItems?.map((product: ProductAffiliate) => (
                      <Col
                        key={product._id}
                        xs={6}
                        sm={4}
                        md={3}
                        lg={4}
                        xl={3}
                        className={styles['product-item-wrapper']}
                      >
                        <ProductItemAffiliate
                          product={product}
                          connected={connectedProductIds[product._id]}
                          onSuccessConnected={refetch}
                        />
                      </Col>
                    ))
                  : !isLoading && <EmptyPage description='В данной категории сейчас нет товаров' />}
                {isLoading && renderSkeletons()}
              </Row>
            </div>
            <Pagination
              classNameWrapper='offset-top-24'
              totalCount={totalCount}
              pageIndex={+String(query?.page) || 1}
              onPage={LIMIT_ITEMS_ON_PAGE}
              onChangeShowMore={onPaginationChange}
              hasPaginationButtons={false}
            />
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default ShopAffiliatePage
