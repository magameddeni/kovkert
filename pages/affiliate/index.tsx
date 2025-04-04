import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { InferGetServerSidePropsType } from 'next'
import { meta, routes } from '@/constants'
import { scrollToTop } from '@/helpers'
import { useQueryParams, useWindowSize } from '@/hooks'
import { ProductAffiliate } from '@/models'
import { Breadcrumbs, Col, Container, EmptyPage, Pagination, Row, Text } from '@/components/UI'
import { AffiliateInfoBlock, ProductItemAffiliate } from '@/components/affiliate'
import { getQueryWithoutCurrentKeys } from '@/components/category/utils'
import { ProductItemSkeleton } from '@/components/product'
import { LIMIT_ITEMS_ON_PAGE } from '@/components/category/const'
import { useGetConnectedProducts } from '@/components/profile/ProfilePartner'
import { getConnectedProductIds } from '@/components/affiliate/utils/getConnectedProductIds'
import Layout from '@/components/layout/Main'
import $api from '@/components/Http/axios'
import styles from './affiliate-page.module.scss'

export const getServerSideProps = async () => {
  const breadcrumbs = [{ _id: routes.AFFILIATE, name: 'Партнерская программа' }]

  return {
    props: {
      breadcrumbs
    }
  }
}

const AffiliatePage = ({ breadcrumbs }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
        `/api/affiliate/programs/available?${new URLSearchParams(queryParams as unknown as string).toString()}`
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
    <Layout meta={{ ...meta.AFFILIATE }}>
      <Container className={styles.affiliate}>
        <Breadcrumbs crumbs={breadcrumbs} />
        <div className={cx(styles.affiliate__title, 'offset-top-16 offset-lg-top-24')}>
          <Text as='h2' color='peach'>
            Партнерская программа
          </Text>
          {!isLarge && <AffiliateInfoBlock asIcon />}
        </div>
        <Row className='offset-top-16 offset-sm-top-20 offset-lg-top-24' row={32}>
          <Col className={styles.affiliate__nav}>
            <AffiliateInfoBlock />
          </Col>
          <Col className={styles.affiliate__content}>
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

export default AffiliatePage
