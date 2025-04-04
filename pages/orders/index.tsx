import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { meta, routes } from '@/constants'
import { useAppSelector } from '@/redux/hook'
import { useQueryParams } from '@/hooks'
import { IOrderGroup } from '@/models/order'
import { Container, Pagination, Text } from '@/components/UI'
import { OrderListSkeleton, HelpSection, OrderGroup } from '@/components/Orders'
import { LIMIT_ITEMS_ON_PAGE } from '@/components/category/const'
import { scrollToTop } from '@/helpers'
import $api from '@/components/Http/axios'
import Layout from '@/components/layout/Main'
import NotAuthorized from '@/components/auth/NotAuthorized'
import s from './orders-page.module.scss'

const OrdersPage = () => {
  const [ordersList, setOrdersList] = useState<IOrderGroup[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isJoinProductsOnPagination, setIsJoinProductsOnPagination] = useState<boolean>(false)

  const { setQuery } = useQueryParams()
  const isAuth = useAppSelector((user) => user.beru.user.isLoggedIn)
  const router = useRouter()

  const getOrders = async () => {
    try {
      if (isAuth) {
        setIsLoading(true)

        const { data: response, status } = await $api.get(
          `/api/orders?limit=${LIMIT_ITEMS_ON_PAGE}&page=${router.query?.page || 1}`
        )
        if (status !== 200) throw new Error('Ошибка получения заказов')

        if (isJoinProductsOnPagination) {
          setOrdersList((prev: IOrderGroup[]) => [...prev, ...response.orders])
        } else {
          setOrdersList(response.orders)
        }
        setTotalCount(response.totalCount)
      }
    } catch (err) {
      console.error(err)
    } finally {
      if (isJoinProductsOnPagination) setIsJoinProductsOnPagination(false)
      setIsLoading(false)
    }
  }

  const onPaginationChange = async (value: number) => {
    scrollToTop()
    if (isJoinProductsOnPagination) setIsJoinProductsOnPagination(false)
    await setQuery({ page: String(value) })
  }

  const onPaginationShowMoreChange = async (value: number) => {
    setIsJoinProductsOnPagination(true)
    await setQuery({ page: String(value) })
  }

  useEffect(() => {
    const fetchData = async () => {
      await getOrders()
    }

    fetchData()
  }, [router.query])

  if (!isAuth) return <NotAuthorized accessToText='заказам' />

  return (
    <Layout meta={{ ...meta.ORDERS }}>
      <Container className={s.orders}>
        <Text as='h2'>Заказы</Text>
        <div className={s.orders__content}>
          <div className={s.orders__container}>
            <div className={s.orders__orders}>
              {!isLoading && !ordersList?.length && <Text as='div'>Вы ничего не заказывали. Поэтому тут пусто</Text>}
              {ordersList.map((order) => (
                <OrderGroup key={order._id} {...order} />
              ))}
              {isLoading && <OrderListSkeleton />}
            </div>
            {ordersList && (
              <Pagination
                classNameWrapper='offset-top-24'
                totalCount={totalCount}
                onPage={LIMIT_ITEMS_ON_PAGE}
                pageIndex={+String(router?.query?.page) || 1}
                onChange={onPaginationChange}
                onChangeShowMore={onPaginationShowMoreChange}
              />
            )}
          </div>
          <div className={s.orders__hepler}>
            <HelpSection
              questions={[
                { title: 'Как отслеживать доставку заказа?', to: `${routes.DOCS}?to=dostavka` },
                { title: 'Как вернуть товар?', to: `${routes.DOCS}?to=vozvrat` }
              ]}
            />
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default OrdersPage
