import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { meta } from '@/constants'
import { IReview } from '@/models'
import { useAppSelector } from '@/redux/hook'
import { DotsLoader, Icon, Text } from '@/components/UI'
import Layout from '@/components/layout/Main'
import NotAuthorized from '@/components/auth/NotAuthorized'
import ReviewBlock from '@/components/Reviews/ReviewBlock/ReviewBlock'
import $api from '@/components/Http/axios'
import s from './index.module.scss'

const ReviewPage = () => {
  const { isLoggedIn } = useAppSelector(({ beru }) => beru.user)
  const { back } = useRouter()

  const { data, error, isLoading } = useQuery<{ reviews: IReview[] }>({
    queryFn: async () => {
      const { data: response, status } = await $api.get('/api/reviews')
      if (status === 200) return response
    },
    queryKey: ['reviews'],
    retry: 1
  })

  if (!isLoggedIn) return <NotAuthorized accessToText='отзывам' />
  if (isLoading) return <DotsLoader center />

  return (
    <Layout meta={{ ...meta.REVIEWS }} hasHeader={false}>
      <div className={s.header}>
        <Icon name='arrow-left2' onClick={back} />
        <Text weight='medium' className={s.header__title}>
          Мои отзывы
        </Text>
      </div>

      <div className={s.page__reviews}>
        {error && (
          <Text as='div' align='center'>
            Не удалось получить отзывы
          </Text>
        )}
        {data?.reviews?.length ? (
          data?.reviews?.map((r) => <ReviewBlock key={r._id} {...r} />)
        ) : (
          <Text as='div' align='center'>
            Вы еще не оставляли отзывы
          </Text>
        )}
      </div>
    </Layout>
  )
}

export default ReviewPage
