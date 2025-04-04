import React, { useCallback, useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { meta, routes } from '@/constants'
import {
  ICheckoutOrder,
  ICheckoutOrderPay,
  IStore,
  IStoreDeliveryMethod,
  IStorePaymentMethod,
  EStoreDeliveryMethodType,
  TUserAddress,
  TUserRecipient,
  TCheckoutItem,
  TCheckoutItemItem,
  TStorePaymentMethodText
} from '@/models'
import { groupBasketItemsByShop } from '@/helpers'
import { useMessage, useWindowSize } from '@/hooks'
import { useAppSelector } from '@/redux/hook'
import { useRemoveBasketItemMutation } from '@/redux/basket/basketApi'
import { Col, Container, DotsLoader, Row, Text } from '@/components/UI'
import { enhastedCheckoutErrorMessage } from '@/components/checkout/utils'
import { CheckoutErrorMessage } from '@/components/checkout/CheckoutErrorMessage'
import $api from '@/components/Http/axios'
import Layout from '@/components/layout/Main'
import CheckoutStoreItems from '@/components/checkout/CheckoutStoreItems'
import CheckoutPaymentMethods from '@/components/checkout/CheckoutPaymentMethods'
import s from './checkout-page.module.scss'

interface ICheckoutParams {
  shopId: string
  payMethodId: string | undefined
  deliveryTypeId?: string | undefined
  address?: string | undefined | null
  recipient?: string | undefined | null
}

interface ISelectedDeliveryAddress {
  [storeId: string]: string | null
}

interface ISelectedRecipient {
  [storeId: string]: TUserRecipient | null
}

interface ISelectedDeliveryMethod {
  [storeId: string]: EStoreDeliveryMethodType
}

const CheckoutPage: React.FC = () => {
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null)
  const [checkoutData, setCheckoutData] = useState<TCheckoutItem[]>([])
  const [shops, setShops] = useState<IStore[]>([])
  const [recipients, setRecipients] = useState<TUserRecipient[]>([])
  const [courierDeliveryAddresses, setCourierDeliveryAddresses] = useState<TUserAddress[]>([])
  const [selectedDeliveryAddresses, setSelectedDeliveryAddresses] = useState<ISelectedDeliveryAddress>({})
  const [selectedRecipient, setSelectedRecipient] = useState<ISelectedRecipient>({})
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<ISelectedDeliveryMethod>({})
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<TStorePaymentMethodText>('Картой онлайн')
  const [userDataLoaded, setUserDataLoaded] = useState<boolean>(false)
  const [checkoutDataLoaded, setCheckoutDataLoaded] = useState<boolean>(false)
  const [selectedDataFilled, setSelectedDataFilled] = useState<boolean>(false)
  const [isLoadingCheckout, setIsLoadingCheckout] = useState<boolean>(false)
  const [isLoadingCheckoutOrder, setIsLoadingCheckoutOrder] = useState<boolean>(false)
  const [sessionErrorMessage, setSessionErrorMessage] = useState<string>('')
  const { isLarge } = useWindowSize()
  const router = useRouter()

  const [removeBasketItem] = useRemoveBasketItemMutation()
  const basketData = useAppSelector(({ beru }) => beru.basket.data)
  const userData = useAppSelector(({ beru }) => beru.user.data)

  const checkoutBasketItems = groupBasketItemsByShop(basketData, true)

  const getShop = async (slug: string) => {
    try {
      const response = await $api.get(`/api/shop/${slug}`)
      return response.data?.shop
    } catch (err) {
      console.error(err)
    }
  }

  const getShops = async (shopSlugs: string[]) => {
    const productShops: IStore[] = []

    for (const storeSlug of shopSlugs) {
      const shop: IStore[] = await getShop(storeSlug)

      if (shop) {
        productShops.push(...shop)
      }
    }

    setShops(productShops)
  }

  const getUserData = async () => {
    try {
      const response = await $api.get('/api/v1.0/users/recipients')
      setRecipients(response.data)
      return response.data
    } catch (err) {
      console.error(err)
    }
  }

  const getUserDeliveryAddress = async () => {
    try {
      const response = await $api.get('/api/v1.0/users/addresses')
      setCourierDeliveryAddresses(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  const removeCheckoutProductsInBasket = async () => {
    try {
      const productIds: string[] = []

      checkoutData.forEach((v: TCheckoutItem) =>
        v.items.forEach((item: TCheckoutItemItem) => productIds.push(item.product._id))
      )

      await removeBasketItem([
        {
          basketId: userData?.basketId,
          items: productIds
        }
      ])
    } catch (error: any) {
      console.error(error)
    }
  }

  const onSubmit = async () => {
    try {
      setIsLoadingCheckoutOrder(true)

      const orderResponse = await $api.post(`/api/checkout/${checkoutSessionId}/order`, null)
      const orderResponseData: ICheckoutOrder = orderResponse?.data?.data

      if (!orderResponseData) {
        return useMessage('Ошибка оформления, обновите страницу', 'error')
      }

      if (orderResponse.status === 200) {
        if (selectedPaymentMethod === 'При получении') {
          await removeCheckoutProductsInBasket()
          return await router.push(`${routes.CHECKOUT}/success/${orderResponseData?._id}`)
        }

        try {
          const payResponse = await $api.post(`/api/orders/${orderResponseData?._id}/pay`)
          const orderPayResponseData: ICheckoutOrderPay = payResponse.data

          if (orderPayResponseData.paymentUrl) {
            await removeCheckoutProductsInBasket()
            await router.push(orderPayResponseData.paymentUrl)
          }
        } catch (err) {
          useMessage('Ошибка онлайн оплаты. Ваш заказ оформлен, но не оплачен', 'error')
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          useMessage(err?.response?.data?.message, 'error')
          router.push('/basket')
          return
        }
        useMessage(err?.response?.data?.message, 'error')
        return
      }
      // @ts-ignore
      useMessage(err?.response?.data?.error?.message, 'error')
    } finally {
      setIsLoadingCheckoutOrder(false)
    }
  }

  const checkout = async (params: ICheckoutParams | object) => {
    try {
      if (!checkoutSessionId) return useMessage('Вернитесь в корзину, для повторного оформления заказа', 'error')
      const response = await $api.patch(`/api/checkout/${checkoutSessionId}`, params)

      setCheckoutData(response.data.data.checkoutItems as TCheckoutItem[])
    } catch (err) {
      setSessionErrorMessage('Время сессии истекло.')
    }
  }

  const getCheckoutSession = async () => {
    try {
      const response = await $api.get(`/api/checkout/${checkoutSessionId}`)
      setCheckoutData(response.data?.data?.[0]?.checkoutItems as TCheckoutItem[])
    } catch (err) {
      console.error(err)
    }
  }

  const updateCheckoutSession = async ({
    shop,
    address,
    recipient,
    payMethod,
    deliveryType
  }: {
    shop: IStore | undefined
    address?: string | null
    recipient?: string | null
    payMethod?: TStorePaymentMethodText
    deliveryType?: EStoreDeliveryMethodType
  }) => {
    if (!shop) return

    const params: ICheckoutParams = {
      payMethodId: shop.paymentMethods.find((v: IStorePaymentMethod) => v.text === (payMethod || selectedPaymentMethod))
        ?._id,
      shopId: shop._id,
      address: null,
      recipient: null
    }

    if (address !== null) {
      params.address = address || selectedDeliveryAddresses[shop._id]
    }
    if (recipient !== null) {
      params.recipient = recipient || selectedRecipient[shop._id]?._id
    }
    if (deliveryType || selectedDeliveryMethod[shop._id]) {
      params.deliveryTypeId = shop.deliveryMethods.find((v: IStoreDeliveryMethod) =>
        deliveryType ? v.text === deliveryType : v.text === selectedDeliveryMethod[shop._id]
      )?._id
    }

    await checkout(params)
  }

  const updateCalculateDelivery = async () => {
    try {
      setIsLoadingCheckout(true)
      const response = await $api.patch(`/api/checkout/${checkoutSessionId}/calculate-delivery`)
      setCheckoutData(response?.data?.data?.checkoutItems as TCheckoutItem[])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingCheckout(false)
    }
  }

  const onDeliveryAddress = async (shop: IStore | undefined, addressId: string | null) => {
    if (!shop) return

    if (shop._id !== selectedDeliveryAddresses[shop._id]) {
      setSelectedDeliveryAddresses((prev: ISelectedDeliveryAddress) => ({
        ...prev,
        [shop._id]: addressId
      }))
      await updateCheckoutSession({ shop, address: addressId })
    }

    if (selectedDeliveryMethod[shop._id] === ('courier' as EStoreDeliveryMethodType)) {
      await updateCalculateDelivery()
    }
  }

  const onRecipient = async (shop: IStore | undefined, recipient: TUserRecipient) => {
    if (!shop) return

    if (recipient._id !== selectedRecipient[shop._id]?._id) {
      setSelectedRecipient((prev: ISelectedRecipient) => ({
        ...prev,
        [shop._id]: recipient
      }))
      await updateCheckoutSession({ shop, recipient: recipient._id })
    }
  }

  const onSuccessNewRecipient = async (shop: IStore | undefined, userId: string) => {
    if (!shop) return

    const userResponse = await getUserData()

    setSelectedRecipient((prev: ISelectedRecipient) => ({
      ...prev,
      [shop._id]: userResponse.find((v: TUserRecipient) => v._id === userId)
    }))

    await updateCheckoutSession({ shop, recipient: userId })
  }

  const onSuccessRemoveRecipient = async (shop: IStore | undefined, userId: string) => {
    if (!shop) return

    if (selectedRecipient[shop._id]?._id === userId) {
      setSelectedRecipient((prev: ISelectedRecipient) => ({
        ...prev,
        [shop._id]: null
      }))

      await updateCheckoutSession({ shop, recipient: null })
    }

    await getUserData()
  }

  const onSuccessNewDeliveryAddress = async (shop: IStore | undefined, addressId: string) => {
    if (!shop) return

    await getUserDeliveryAddress()
    await onDeliveryAddress(shop, addressId)
  }

  const onDeliveryMethod = async (shop: IStore | undefined, deliveryMethod: EStoreDeliveryMethodType) => {
    if (!shop) return

    if (selectedDeliveryMethod[shop?._id] !== deliveryMethod) {
      setSelectedDeliveryMethod((prev: { [shopId: string]: EStoreDeliveryMethodType }) => ({
        ...prev,
        [shop._id]: deliveryMethod
      }))
      setSelectedDeliveryAddresses((prev: ISelectedDeliveryAddress) => ({
        ...prev,
        [shop._id]: null
      }))

      await updateCheckoutSession({ shop, deliveryType: deliveryMethod, address: null })
      if (deliveryMethod === 'self-delivery') await updateCalculateDelivery()
    }
  }

  const onPaymentMethod = async (method: TStorePaymentMethodText) => {
    setSelectedPaymentMethod(method)

    for (const shopIndex of shops) {
      await updateCheckoutSession({ shop: shopIndex, payMethod: method })
    }
  }

  const canPayOrder = useCallback((): string => {
    let message: string = ''

    if (!Object.values(selectedDeliveryAddresses).every((v: string | null) => v !== null && Boolean(v))) {
      message = 'Укажите адрес доставки'
    }

    if (!Object.values(selectedRecipient).every((v: TUserRecipient | null) => v !== null && Boolean(v))) {
      message = message ? `${message} и получателя` : 'Укажите получателя'
    }

    return message
  }, [selectedRecipient, selectedDeliveryAddresses])

  useEffect(() => {
    const fetchData = async () => {
      if (Object.values(checkoutBasketItems)?.length) {
        await getShops(Object.values(checkoutBasketItems).map((v) => v.inStock[0].product.shop?.slug))
      }

      await getUserData()
      await getUserDeliveryAddress()
      setUserDataLoaded(true)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (userDataLoaded) {
        await getCheckoutSession()
        setCheckoutDataLoaded(true)
      }
    }

    fetchData()
  }, [userDataLoaded])

  useEffect(() => {
    const fetchData = async () => {
      if (checkoutDataLoaded) {
        const defaultSelectedDeliveryAddress: ISelectedDeliveryAddress = {}
        const defaultSelectedDeliveryMethod: ISelectedDeliveryMethod = {}
        const defaultSelectedRecipient: ISelectedRecipient = {}
        let defaultPaymentMethod: TStorePaymentMethodText = 'Картой онлайн'

        if (checkoutData) {
          checkoutData.forEach((v: TCheckoutItem) => {
            const checkoutItemShopId = v.shop._id

            const getDeliveryMethod = (): EStoreDeliveryMethodType => {
              const correctMethodText = v.deliveryType
                ? shops
                    .find((shop: IStore) => shop._id === checkoutItemShopId)
                    ?.deliveryMethods?.find(
                      (deliveryMethod: IStoreDeliveryMethod) => deliveryMethod._id === v.deliveryType
                    )?.text
                : ('self-delivery' as EStoreDeliveryMethodType)

              return correctMethodText || ('self-delivery' as EStoreDeliveryMethodType)
            }

            const getRecipient = () => {
              const correctRecipient = v?.recipient
                ? recipients?.find((recipient: TUserRecipient) => recipient._id === v.recipient)
                : recipients?.[recipients?.length - 1]

              return correctRecipient || recipients?.[recipients?.length - 1] || null
            }

            const getPayment = () => {
              const correctPayment = v?.payMethod
                ? shops
                    .find((shop: IStore) => shop._id === checkoutItemShopId)
                    ?.paymentMethods?.find((paymentMethod: IStorePaymentMethod) => paymentMethod._id === v.payMethod)
                    ?.text
                : 'Картой онлайн'

              return correctPayment || 'Картой онлайн'
            }

            defaultSelectedDeliveryAddress[checkoutItemShopId] =
              v?.address?._id || (getDeliveryMethod() === 'self-delivery' ? v.shop.addresses[0]._id : null)
            defaultSelectedDeliveryMethod[checkoutItemShopId] = getDeliveryMethod()
            defaultSelectedRecipient[checkoutItemShopId] = getRecipient()
            defaultPaymentMethod = getPayment()
          })

          setSelectedDeliveryAddresses(defaultSelectedDeliveryAddress)
          setSelectedDeliveryMethod(defaultSelectedDeliveryMethod)
          setSelectedRecipient(defaultSelectedRecipient)
          setSelectedPaymentMethod(defaultPaymentMethod)
        }

        setSelectedDataFilled(true)
      }
    }

    fetchData()
  }, [checkoutDataLoaded])

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDataFilled && checkoutSessionId) {
        for (const shop of shops as IStore[]) {
          await updateCheckoutSession({ shop })
        }
      }
    }

    void fetchData()
  }, [selectedDataFilled, checkoutSessionId])

  useEffect(() => {
    const sessionId: string = router.asPath.split('session=')[1]

    if (sessionId) {
      if (!checkoutSessionId) setCheckoutSessionId(sessionId)
    } else {
      useMessage('Нет доступа к странице', 'error')
      router.back()
    }
  }, [router.query.session])

  if (!selectedDataFilled) return <DotsLoader center />

  return (
    <Layout meta={{ ...meta.CHECKOUT }} className={s['checkout-wrapper']} offsetBottom={isLarge ? undefined : 0}>
      <header className={s['checkout-header']}>
        <Container small>
          <Link href={routes.MAIN}>
            <div className={s.logo}>
              <img src='/logo.svg' alt='logo' />
            </div>
          </Link>
        </Container>
      </header>
      <Container className={s.checkout} small>
        <Text as='h2' className='offset-top-24'>
          Оформление заказа
        </Text>
        {checkoutData?.length || !sessionErrorMessage ? (
          <Row row={32} className='offset-top-20 offset-sm-top-24 offset-lg-top-32' small>
            <Col className={s.checkout__content}>
              {checkoutData?.map((v: TCheckoutItem) => (
                <CheckoutStoreItems
                  key={v._id}
                  shop={shops.find((shop: IStore) => shop?._id === v.shop._id)}
                  checkoutItems={v}
                  recipients={recipients}
                  courierDeliveryAddresses={courierDeliveryAddresses}
                  activeDeliveryAddresses={selectedDeliveryAddresses[v.shop._id]}
                  activeRecipient={selectedRecipient[v.shop._id] as TUserRecipient}
                  activeDeliveryMethod={selectedDeliveryMethod[v.shop._id]}
                  onDeliveryAddress={onDeliveryAddress}
                  onRecipient={onRecipient}
                  onDeliveryMethod={onDeliveryMethod}
                  onSuccessNewRecipient={onSuccessNewRecipient}
                  onSuccessRemoveRecipient={onSuccessRemoveRecipient}
                  onSuccessNewDeliveryAddress={onSuccessNewDeliveryAddress}
                  getUserData={getUserData}
                  getUserDeliveryAddress={getUserDeliveryAddress}
                />
              ))}
            </Col>
            <Col className={s.checkout__payment}>
              <CheckoutPaymentMethods
                paymentMethod={selectedPaymentMethod}
                onPaymentMethod={onPaymentMethod}
                checkoutItems={checkoutData}
                disableMessage={canPayOrder()}
                selectedDeliveryMethod={selectedDeliveryMethod}
                onSubmit={onSubmit}
                isLoading={isLoadingCheckoutOrder || isLoadingCheckout}
              />
            </Col>
          </Row>
        ) : (
          <CheckoutErrorMessage
            message={enhastedCheckoutErrorMessage(sessionErrorMessage || 'Произошла какая-то ошибка.')}
          />
        )}
      </Container>
    </Layout>
  )
}

export default CheckoutPage
