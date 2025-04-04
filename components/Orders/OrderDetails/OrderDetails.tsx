import React, { useState } from 'react'
import cx from 'classnames'
import { IOrder } from '@/models'
import { convertPrice, setSpaceBetweenCharacters } from '@/helpers'
import { Button, Modal, Text } from '@/components/UI'
import AddressPVZ from '@/components/Modals/AddressPVZ/AddressPVZ'
import s from './order_details.module.scss'

interface IOrderDetailsProps {
  order: IOrder
}

const OrderDetails: React.FC<IOrderDetailsProps> = ({ order }) => {
  const [openModalPvz, setOpenModalPvz] = useState(false)

  const isPickupDelivery = order.deliveryType.label === 'Самовывоз из магазина'

  const onRequestClose = () => setOpenModalPvz(false)

  return (
    <div className={s.details}>
      <div className={s.details__sections}>
        <div className={s.details__details}>
          <Text as='div' className='offset-bottom-12' family='secondary' color='primary'>
            Детали заказа
          </Text>
          <article className={s.details__article}>
            <section className={s.details__section}>
              <div className={s.details__section_title}>Номер заказа</div>
              <div className={s.details__section_value}>{order.orderNumber.toString()}</div>
            </section>
          </article>
          <article className={s.details__article}>
            <section className={s.details__section}>
              <div className={s.details__section_title}>Способ оплаты</div>
              <div className={s.details__section_value}>{order.paymentMethod.label}</div>
            </section>
          </article>
          <article className={s.details__article}>
            <section className={s.details__section}>
              <div className={s.details__section_title}>Товары</div>
              <div className={s.details__section_value}>{setSpaceBetweenCharacters(order.totalPrice)} ₽</div>
            </section>
          </article>
          {order.deliveryType.label === 'Доставка курьером' && order?.deliveryPrice && (
            <>
              <article className={s.details__article}>
                <section className={s.details__section}>
                  <div className={s.details__section_title}>Доставка</div>
                  <div className={s.details__section_value}>{setSpaceBetweenCharacters(order.deliveryPrice)} ₽</div>
                </section>
              </article>
              <article className={s.details__article}>
                <section className={s.details__section}>
                  <div className={s.details__section_title}>Итого</div>
                  <div className={cx(s.details__section_value, s.bold)}>
                    {setSpaceBetweenCharacters(convertPrice(order.totalPrice + order.deliveryPrice))} ₽
                  </div>
                </section>
              </article>
            </>
          )}
        </div>
        <div className={s.details__pay_method}>
          <Text as='div' className='offset-bottom-12' family='secondary' color='primary'>
            Способ получения
          </Text>
          <article className={s.details__article}>
            <section className={s.details__section}>
              <div className={s.details__section_title}>{order.deliveryType.label}</div>
              <div className={s.details__section_value}>{order.deliveryAddress}</div>
            </section>
            {order.recipient && (
              <section className={s.details__section}>
                <div className={s.details__section_title}>Получатель</div>
                <div className={s.details__section_value}>
                  <div>
                    {order.recipient?.lastName} {order.recipient?.firstName}
                  </div>
                  <div>{order.recipient.phone}</div>
                  {order.recipient.email && <div>{order.recipient.email}</div>}
                </div>
              </section>
            )}
          </article>
        </div>
        <div className={s.details__shop}>
          <Text as='div' className='offset-bottom-12' family='secondary' color='primary'>
            {order.shop.name}
          </Text>
          <article className={s.details__article}>
            <section className={s.details__section}>
              <div className={s.details__section_title}>Адрес</div>
              <div className={s.details__section_value}>{order.shop.address}</div>
            </section>
            <section className={s.details__section}>
              <div className={s.details__section_title}>Телефон</div>
              <div className={s.details__section_value}>{order.shop.phoneNumber}</div>
            </section>
            {order.shop.email && (
              <section className={s.details__section}>
                <div className={s.details__section_title}>Email</div>
                <div className={s.details__section_value}>{order.shop.email}</div>
              </section>
            )}
          </article>
        </div>
      </div>
      {isPickupDelivery && (
        <Button onClick={() => setOpenModalPvz(true)} view='secondary' className={s.details__button} fluid>
          Пункт выдачи на карте
        </Button>
      )}
      <Modal isOpen={openModalPvz} onRequestClose={onRequestClose} size='md' topBottomBorder={false}>
        <AddressPVZ
          coordinates={order.shop.coordinates}
          address={order.shop.address}
          phoneNumber={order.shop.phoneNumber}
          onRequestClose={onRequestClose}
        />
      </Modal>
    </div>
  )
}
export default OrderDetails
