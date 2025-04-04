import React from 'react'
import $api from '@/components/Http/axios'
import { useQuery } from '@tanstack/react-query'
import ProfileReview from '@/components/Reviews/ReviewBlock/ReviewBlock'
import { DotsLoader, Text } from '@/components/UI'
import { IReview } from '@/models'
import s from './style.module.scss'

const ProfileReviews = () => {
  const { data, error, isLoading } = useQuery<{ reviews: IReview[]; total: number }>({
    queryFn: async () => {
      const { data: response, status } = await $api.get('/api/reviews')

      if (status === 200) return response
    },
    queryKey: ['reviews']
  })

  if (isLoading) return <DotsLoader center />

  return (
    <div className={s.reviews}>
      {error && (
        <Text as='div' align='center'>
          Не удалось получить отзывы
        </Text>
      )}
      {data?.reviews.length ? (
        data?.reviews.map((r) => <ProfileReview key={r._id} {...r} />)
      ) : (
        <Text as='div'>Вы еще не оставляли отзывы</Text>
      )}
    </div>
  )
}

export default ProfileReviews
