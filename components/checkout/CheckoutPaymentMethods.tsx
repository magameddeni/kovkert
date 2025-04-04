import React from 'react'
import Link from 'next/link'
import cx from 'classnames'
import { routes } from '@/constants'
import { EStoreDeliveryMethodType, TCheckoutItem, TCheckoutItemItem, TStorePaymentMethodText } from '@/models'
import { convertPrice, productDeclension, setSpaceBetweenCharacters } from '@/helpers'
import { Button, Icon, Text } from '@/components/UI'
import s from './checkout.module.scss'

interface ICheckoutPaymentMethodsProps {
  paymentMethod: TStorePaymentMethodText
  onPaymentMethod: (method: TStorePaymentMethodText) => void
  checkoutItems: TCheckoutItem[]
  selectedDeliveryMethod: { [storeId: string]: EStoreDeliveryMethodType }
  disableMessage: string
  onSubmit: VoidFunction
  isLoading: boolean
}

const CheckoutPaymentMethods = ({
  paymentMethod,
  onPaymentMethod,
  checkoutItems,
  selectedDeliveryMethod,
  disableMessage,
  onSubmit,
  isLoading
}: ICheckoutPaymentMethodsProps) => {
  const storeItemLength = checkoutItems?.reduce((acc: number, v: TCheckoutItem) => acc + v.items.length, 0) ?? 0
  const totalPrice = checkoutItems?.reduce((acc: number, v: TCheckoutItem) => {
    let productsTotalPrice = acc + v.totalPrice

    if (selectedDeliveryMethod[v.shop._id] === 'courier' && v?.deliveryPrice) {
      productsTotalPrice += v.deliveryPrice
    }

    return productsTotalPrice
  }, 0)

  const paymentMethodHandler = (method: TStorePaymentMethodText) => {
    if (method !== paymentMethod) {
      onPaymentMethod(method)
    }
  }

  if (!checkoutItems?.length) return null

  return (
    <div className={s['checkout-payment-methods']}>
      <Text as='p' size='lg' family='secondary'>
        Способ оплаты
      </Text>
      <div className={s['checkout-payment-methods__methods']}>
        <div
          className={cx(s['payment-method-cart'], { [s.active]: paymentMethod === 'Картой онлайн' })}
          onClick={() => paymentMethodHandler('Картой онлайн')}
        >
          <Icon name='credit-card' />
          <Text family='secondary'>Картой онлайн</Text>
        </div>
        <div
          className={cx(s['payment-method-cart'], { [s.active]: paymentMethod === 'При получении' })}
          onClick={() => paymentMethodHandler('При получении')}
        >
          <Icon name='wallet' />
          <Text family='secondary'>При получении заказа</Text>
        </div>
      </div>
      {checkoutItems.map((v: TCheckoutItem) => {
        const storeItemsQuantity = v.items.reduce((acc: number, item: TCheckoutItemItem) => acc + item.quantity, 0)
        const isSelfDelivery = selectedDeliveryMethod[v.shop._id] === 'self-delivery'

        return (
          <div
            key={v._id}
            className={cx(s['checkout-payment-methods__prices'], { [s['several-stores']]: storeItemLength > 1 })}
          >
            {storeItemLength > 1 && (
              <div className={s['store-name']}>
                <Text size='xxs' family='secondary'>
                  {v.shop.name}
                </Text>
              </div>
            )}
            <div className={s['item-price']}>
              <Text size='xxs'>
                {storeItemsQuantity} {productDeclension(storeItemsQuantity)}
              </Text>
              <Text size='xxs'>{setSpaceBetweenCharacters(v.totalPrice)} ₽</Text>
            </div>
            {isSelfDelivery ? (
              <div className={s['item-price']}>
                <Text size='xxs'>Самовывоз</Text>
                <Text size='xxs'>Бесплатно</Text>
              </div>
            ) : (
              <div className={s['item-price']}>
                <Text size='xxs'>Курьерская доставка</Text>
                <Text size='xxs'>
                  {`${v?.deliveryPrice ? setSpaceBetweenCharacters(v?.deliveryPrice.toFixed(0)) : 0} ₽` ||
                    'Не выбран адрес'}
                </Text>
              </div>
            )}
          </div>
        )
      })}
      <div className={s['checkout-payment-methods__final-price']}>
        <Text size='lg' family='secondary'>
          Итого
        </Text>
        <Text size='xxl' family='secondary'>
          {setSpaceBetweenCharacters(convertPrice(totalPrice))} ₽
        </Text>
      </div>
      <div className={s['checkout-payment-methods__next-step']}>
        <Button disabled={Boolean(disableMessage) || isLoading} onClick={onSubmit} fluid>
          {paymentMethod === 'Картой онлайн' ? 'Оплатить' : 'Оформить заказ'}
        </Button>
        {Boolean(disableMessage) && (
          <Text as='p' color='orange' className='offset-top-16' size='xxs'>
            {disableMessage}
          </Text>
        )}
        <div className={s.policy}>
          <Text as='p'>
            Нажимая кнопку «Оплатить», я даю свое согласие на сбор и обработку моих персональных данных в соответствии с
            <Link href={`${routes.DOCS}?to=usloviya-obrabotki-personalnikh-dannikh`} target='_blank'>
              <Text color='blue'>Политикой</Text>
            </Link>
            и принимаю условия
            <Link href={`${routes.DOCS}?to=oferta_dlya_pokupateley`} target='_blank'>
              <Text color='blue'>Публичной оферты</Text>
            </Link>
          </Text>
        </div>
      </div>
    </div>
  )
}

export default React.memo(CheckoutPaymentMethods)
