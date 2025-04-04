import React, { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { meta, routes } from '@/constants'
import { IBasketItem } from '@/models'
import { useWindowSize, useChangeBasketItem, useSelectBasketItem } from '@/hooks'
import { useAppSelector } from '@/redux/hook'
import { useGetBasketMutation } from '@/redux/basket/basketApi'
import { convertPrice, groupBasketItemsByShop, productDeclension, setSpaceBetweenCharacters } from '@/helpers'
import { Button, Col, Container, EmptyPage, Row, Text } from '@/components/UI'
import { emptyMessages, emptyMessagesWithoutAuth } from '@/components/basket'
import emitter, { EVENTS } from '@/utils/emitter'
import $api from '@/components/Http/axios'
import Layout from '@/components/layout/Main'
import BasketShopItemsGroup from '@/components/basket/BasketShopItemsGroup'
import WatchedProducts from '@/components/WatchedProducts/WatchedProducts'
import styles from './basket-page.module.scss'

const BasketPage = () => {
  const { isSmall, isLarge } = useWindowSize()
  const { changeBasketItemCount } = useChangeBasketItem()
  const { selectBasketItemCount } = useSelectBasketItem()
  const router = useRouter()

  const [getBasket] = useGetBasketMutation()
  const { data: basketData, totalPrice, totalPriceBeforeDiscount, quantity } = useAppSelector(({ beru }) => beru.basket)
  const { data: authData, isLoggedIn } = useAppSelector(({ beru }) => beru.user)

  const hasTotalDiscountPrice = useMemo(
    () => totalPriceBeforeDiscount > totalPrice,
    [totalPriceBeforeDiscount, totalPrice]
  )

  const hasSelectedItems = useMemo(
    () => Boolean(basketData.filter((v: IBasketItem) => v.selected).length),
    [basketData]
  )

  const emptyMessageText = useMemo(
    () => (isLoggedIn ? { ...emptyMessages } : { ...emptyMessagesWithoutAuth }),
    [isSmall]
  )

  const createCheckoutSession = async (basketId: string | undefined) => {
    try {
      if (!basketId) return

      const response = await $api.post(`/api/basket/${basketId}/checkout`, null)
      const responseData: { checkoutSessionId: string } = response.data

      return responseData.checkoutSessionId
    } catch (error: any) {
      console.error(error)
    }
  }

  const nextStep = async () => {
    if (authData) {
      const checkoutSessionId = await createCheckoutSession(authData?.basketId)
      await router.push(`${routes.CHECKOUT}?session=${checkoutSessionId}`)
    } else {
      emitter.emit(EVENTS.SHOW_LOGIN_MODAL)
    }
  }

  useEffect(() => {
    if (isLoggedIn && authData?.basketId) {
      try {
        getBasket(authData.basketId)
      } catch (error: any) {
        console.error(error)
      }
    }
  }, [])

  useEffect(() => {
    if (basketData?.length) {
      basketData.forEach((v: IBasketItem) => {
        if (v?.product && v.quantity > v.product.stock) {
          if (v?.product?.stock || isLoggedIn) {
            void changeBasketItemCount(v.product.stock, v.product)
          }

          if (!v.product.stock && v.selected) {
            selectBasketItemCount(false, [isLoggedIn ? (v._id as string) : v.product._id])
          }
        }
      })
    }
  }, [basketData])

  return (
    <Layout meta={{ ...meta.BASKET }} offsetBottom={!isLarge ? 100 : undefined}>
      {basketData.length ? (
        <Container className={styles.basket}>
          <div className={styles.basket__title}>
            <Text as='h2'>Корзина</Text>
            <Text as='p' size='sm' family='secondary' className={styles['products-count']}>
              {quantity}
              <Text size='sm' color='gray' family='secondary'>
                {productDeclension(quantity)}
              </Text>
            </Text>
          </div>
          <Row className={styles.row}>
            <Col className={styles.basket__content}>
              {Object.entries(groupBasketItemsByShop(basketData)).map(([shopId, basketProductItems]) => (
                <BasketShopItemsGroup key={Math.random()} shopId={shopId} {...basketProductItems} />
              ))}
            </Col>
            <Col className={styles['basket__next-step-button']}>
              <div className={styles['next-step-button-block']}>
                {hasSelectedItems && (
                  <div className={styles['price-block']}>
                    {hasTotalDiscountPrice && (
                      <div className={styles['price-block__final']}>
                        <Text family='secondary'>Скидка</Text>
                        <Text family='secondary' color='red'>
                          -{setSpaceBetweenCharacters(convertPrice(totalPriceBeforeDiscount - totalPrice))} ₽
                        </Text>
                      </div>
                    )}
                    <div className={styles['price-block__final']}>
                      <Text family='secondary'>Итого</Text>
                      <Text size='xxl' family='secondary'>
                        {setSpaceBetweenCharacters(convertPrice(totalPrice))} ₽
                      </Text>
                    </div>
                  </div>
                )}
                <div>
                  <Button fluid disabled={!hasSelectedItems} onClick={nextStep}>
                    Оформить заказ
                  </Button>
                </div>
                {!hasSelectedItems && (
                  <Text as='p' className={styles['select-items-message']} size='xxs' align='center'>
                    Выберите товары, чтобы оформить заказ
                  </Text>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container>
          <EmptyPage className={styles['empty-page-message']} {...emptyMessageText}>
            {!isLoggedIn ? (
              <Button
                className={styles['empty-page-message__button']}
                onClick={() => emitter.emit(EVENTS.SHOW_LOGIN_MODAL)}
              >
                Войти в профиль
              </Button>
            ) : null}
          </EmptyPage>
          <WatchedProducts />
        </Container>
      )}
    </Layout>
  )
}

export default BasketPage
