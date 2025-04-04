import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { routes } from '@/constants'
import { IOrderGroup, IOrderGroupOrderItem } from '@/models'
import { useOrderPaymentTimer, useWindowSize } from '@/hooks'
import { setSpaceBetweenCharacters } from '@/helpers'
import { Button, ButtonGroup, Gap, Text, GapPosition } from '@/components/UI'
import { OrderItemThumbnail, OrderItemThumbnailSlider, OrderStatus, deliveryLabelsById } from '@/components/Orders'
import { isWaitingForPayStatus } from '@/utils/isWaitingForPayStatus'
import useTimeHook from '@/components/Hooks/useTimeHook'
import s from './order_group.module.scss'

const OrderGroup: React.FC<IOrderGroup> = ({
  createdAt,
  orderNumber,
  orderItems,
  totalPrice,
  _id,
  orders,
  paymentUrl
}) => {
  const { orderStatus } = useOrderPaymentTimer({ createdOrder: createdAt, status: orders?.[0]?.status })
  const { isSmall, isLarge } = useWindowSize()
  const { day, monthLong, yearLong } = useTimeHook(createdAt)
  const router = useRouter()

  const deliveryLabel = useMemo(() => deliveryLabelsById?.[orders?.[0]?.deliveryType?._id], [orders])

  return (
    <div className={s['order-group']}>
      <div className={s['order-group__number']}>
        <div>№ {orderNumber}</div>
        {isLarge && <div>{setSpaceBetweenCharacters(totalPrice)} ₽</div>}
      </div>
      <div className={s['order-group__date-and-status']}>
        <Text color='gray'>
          {day} {monthLong} {yearLong}
        </Text>
        <Gap size={12} position={GapPosition.Horizontal} />
        {orderStatus && <OrderStatus status={orderStatus} />}
        {isLarge && (
          <Text className={s['delivery-status']} color='gray'>
            {deliveryLabel === 'Доставка' ? '+' : ''} {deliveryLabel}
            <Text family='secondary' color='gray'>
              {orders?.[0]?.deliveryPrice ? ` ${orders?.[0]?.deliveryPrice} ₽` : ''}
            </Text>
          </Text>
        )}
      </div>
      <div className={s['order-group__products']}>
        {isSmall ? (
          <OrderItemThumbnailSlider items={orderItems} />
        ) : (
          orderItems.map((v: IOrderGroupOrderItem) => <OrderItemThumbnail key={v._id} item={v} />)
        )}
      </div>
      <ButtonGroup className={s['order-group__footer']}>
        {isWaitingForPayStatus(orderStatus) && (
          <Button className={s['pay-button']} onClick={() => window.open(paymentUrl as string, '_blank')}>
            Оплатить
          </Button>
        )}
        <Button className={s['more-button']} onClick={() => router.push(`${routes.ORDERS}/${_id}`)}>
          Подробнее
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default OrderGroup
