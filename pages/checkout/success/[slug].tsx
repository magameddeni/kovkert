import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { meta, routes } from '@/constants'
import { Button, Container, Text, DotsLoader } from '@/components/UI'
import { IOrderResponse } from '@/models'
import { useQuery } from '@tanstack/react-query'
import Layout from '@/components/layout/Main'
import $api from '@/components/Http/axios'
import s from '@/pages/checkout/checkout-page.module.scss'

const CheckoutSuccessPage = () => {
  const router = useRouter()

  const { data: orderResponse } = useQuery<IOrderResponse>({
    queryKey: ['GET_ORDER', router?.query?.slug],
    queryFn: async () => {
      if (router?.query?.slug) {
        const { data, status } = await $api(`/api/orders/${router?.query?.slug}`)
        if (status !== 200) throw new Error('Ошибка получения заказа')

        return data
      }
    }
  })

  return (
    <Layout meta={{ ...meta.CHECKOUT_SUCCESS }} className={s['checkout-wrapper']}>
      <header className={s['checkout-header']}>
        <Container small>
          <Link href={routes.MAIN}>
            <div className={s.logo}>
              <img src='/logo.svg' alt='logo' />
            </div>
          </Link>
        </Container>
      </header>
      <Container small>
        <div className={s['checkout-success']}>
          <div className={s['checkout-success__image']}>
            <img src='/checkout-success.png' alt='logo' />
          </div>
          <Text as='h2' className='offset-top-32'>
            Заказ успешно оформлен
          </Text>
          <Text as='p' className={s['checkout-success__order-number']} align='center'>
            Номер вашего заказа
            <Text family='secondary'>{orderResponse?.orderNumber ?? <DotsLoader size='sm' />}</Text>
          </Text>
          <Text as='p' className='offset-top-16' align='center'>
            Мы свяжемся с вами в ближайшее время и поможем вам подобрать наиболее оптимальный способ доставки
          </Text>
          <Button className='offset-top-32' onClick={() => router.push(routes.CATEGORY)}>
            Продолжить покупки
          </Button>
        </div>
      </Container>
    </Layout>
  )
}

export default CheckoutSuccessPage
