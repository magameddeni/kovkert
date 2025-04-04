import React, { useState } from 'react'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '@/redux/hook'
import { IOrder, IOrderResponse } from '@/models'
import { meta, routes } from '@/constants'
import { useMessage, useOrderPaymentTimer, useWindowSize } from '@/hooks'
import { Button, Container, Text } from '@/components/UI'
import { OrderDetails, OrderItem, OrderItemSkeleton, OrderStatus } from '@/components/Orders'
import { isWaitingForPayStatus } from '@/utils/isWaitingForPayStatus'
import useTimeHook from '@/components/Hooks/useTimeHook'
import Layout from '@/components/layout/Main'
import NotAuthorized from '@/components/auth/NotAuthorized'
import $api from '@/components/Http/axios'
import s from './orders-page.module.scss'

interface OrderPageType {
  id: string
}

export const getServerSideProps = async (context: NextPageContext) => ({
  props: { id: context.query.slug }
})

const OrderPage: React.FC<OrderPageType> = ({ id }) => {
  const [groupedOrdersByShop, setGroupedOrdersByShop] = useState<Record<string, IOrder[]> | null>(null)
  const { isLarge } = useWindowSize()
  const router = useRouter()

  const isAuth = useAppSelector((store) => store.beru.user.isLoggedIn)

  const handleBack = () => router.push(routes.ORDERS)

  const getGroupedOrdersByShop = (orders: IOrder[] | undefined) => {
    if (!orders) return

    const groupedOrders = {} as Record<string, IOrder[]>

    orders.forEach((v: IOrder) => {
      if (!groupedOrders[v.shop._id]) {
        return (groupedOrders[v.shop._id] = [v])
      }

      return groupedOrders[v.shop._id].push(v)
    })

    setGroupedOrdersByShop(groupedOrders)
  }

  const { data, isLoading } = useQuery<IOrderResponse>({
    queryKey: ['GET_ORDER', id, isAuth],
    queryFn: async () => {
      if (isAuth) {
        const { data: orders, status } = await $api(`/api/orders/${id}`)
        if (status !== 200) throw new Error('Ошибка получения заказа')

        getGroupedOrdersByShop(orders?.orders)
        return orders
      }

      return null
    },
    refetchOnWindowFocus: false
  })

  const getCheckOrder = () => {
    $api
      .get(`/api/orders/receipt/${data?.orderNumber}`)
      .then((response) => setTimeout(() => window.open(response.data.url, '_blank')))
      .catch((error) => useMessage(error.response.data.error, 'info'))
  }

  const { orderStatus } = useOrderPaymentTimer({ createdOrder: data?.createdAt, status: data?.orders?.[0]?.status })
  const { day, monthLong, yearLong } = useTimeHook((data && data.createdAt) ?? new Date())

  if (!isAuth) return <NotAuthorized accessToText='заказу' />

  return (
    <Layout meta={{ ...meta.ORDERS_SLUG }}>
      <Container className={s.order}>
        {(isLarge || !data) && (
          <Button
            iconLeft='arrow-left'
            iconOptions={{ size: 'xs', color: 'gray' }}
            className={s['back-button']}
            onClick={handleBack}
          >
            Заказы
          </Button>
        )}
        {typeof data === 'object' && (
          <div className={s.order__header}>
            <div className={s['order-info']}>
              <div className={s['order-info__number-and-status']}>
                {data?.orderNumber && (
                  <Text as='h2' className={s['order-number']}>
                    Заказ № {data.orderNumber}
                  </Text>
                )}
                {orderStatus && <OrderStatus status={orderStatus} />}
              </div>
              <div className={s['order-info__date-and-check']}>
                <Text color='gray'>
                  {day} {monthLong} {yearLong}
                </Text>
                {data.hasReceipt && (
                  <Button view='link' className={s['check-button']} onClick={getCheckOrder}>
                    Скачать чек
                  </Button>
                )}
              </div>
            </div>
            {isWaitingForPayStatus(orderStatus) && data?.paymentUrl && (
              <div className={s['pay-button']}>
                <Button onClick={() => window.open(data.paymentUrl as string, '_blank')} fluid>
                  Оплатить
                </Button>
              </div>
            )}
          </div>
        )}
        <div className={s.order__orders}>
          {isLoading ? (
            <div className={s.order__order}>
              <div className={s.order__order_products}>
                {new Array(3).fill('').map(() => (
                  <OrderItemSkeleton key={Math.random()} />
                ))}
              </div>
            </div>
          ) : groupedOrdersByShop ? (
            Object.entries(groupedOrdersByShop).map(([shopId, order]: [string, IOrder[]]) => (
              <div key={shopId} className={s.order__order}>
                <div className={s.order__order_products}>
                  {order.map((v: IOrder) => (
                    <OrderItem key={v._id} item={v.orderItems[0]} status={v.status} />
                  ))}
                </div>
                <OrderDetails order={order[0]} />
              </div>
            ))
          ) : (
            <Text>Ошибка получения заказа</Text>
          )}
        </div>
      </Container>
    </Layout>
  )
}

export default OrderPage
