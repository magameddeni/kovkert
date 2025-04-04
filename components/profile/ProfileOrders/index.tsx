import React from 'react'
import { useAppSelector } from '@/redux/hook'
import { useQuery } from '@tanstack/react-query'
import { routes } from '@/constants'
import { IOrderGroupResponse } from '@/models/order'
import { OrderGroup } from '@/components/Orders'
import Link from 'next/link'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import $api from '@/components/Http/axios'
import styles from './styles.module.scss'
import 'react-loading-skeleton/dist/skeleton.css'

const ProfileOrders = () => {
  const isAuth = useAppSelector((user) => user.beru.user.isLoggedIn)

  const { data, isLoading } = useQuery<IOrderGroupResponse>({
    queryFn: async () => {
      if (isAuth) {
        const { data: rData, status } = await $api.get('/api/orders?limit=1&page=1')
        if (status !== 200) throw new Error('Ошибка получения заказов')
        return rData
      }
      return null
    },
    queryKey: ['GET_ORDERS']
  })

  const showMore = Array.isArray(data?.orders) && Boolean(data?.orders?.length)

  const renderOrders = () => data?.orders?.map((order) => <OrderGroup key={order._id} {...order} />)

  if (isLoading) {
    return (
      <SkeletonTheme>
        <Skeleton height={300} />
      </SkeletonTheme>
    )
  }

  if (!data?.orders?.length) {
    return <div className={styles.orders__empty}>Заказов нет</div>
  }

  return (
    <div className={styles.orders}>
      {renderOrders()}
      {showMore && (
        <Link className={styles.orders__link} href={routes.ORDERS}>
          Все заказы
        </Link>
      )}
    </div>
  )
}

export default ProfileOrders
