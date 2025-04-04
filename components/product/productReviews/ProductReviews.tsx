import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { routes } from '@/constants'
import { useAppSelector } from '@/redux/hook'
import { IReview } from '@/models'
import { useWindowSize } from '@/hooks'
import {
  ProductReviewsSkeleton,
  ReviewsRating,
  ReviewsRatingData,
  ReviewsRatingSkeleton,
  ProductReview
} from '@/components/product'
import { Button, Checkbox, Select, Text } from '@/components/UI'
import $api from '@/components/Http/axios'
import emitter, { EVENTS } from '@/utils/emitter'
import { sorList } from './const'
import s from './product_reviews.module.scss'

interface ProductReviewsProps {
  productId: string
  ratingData: ReviewsRatingData | undefined
  isLoadingRating: boolean
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, ratingData, isLoadingRating }) => {
  const [checkImage, setCheckImage] = useState<undefined | boolean>(undefined)
  const [hasReviews, setHasReviews] = useState<boolean>(false)
  const [sort, setSort] = useState(sorList[0])
  const { isSmall } = useWindowSize()
  const router = useRouter()
  const limit: number = 10

  const { isLoggedIn } = useAppSelector(({ beru }) => beru.user)

  const handlerLoginModal = () => emitter.emit(EVENTS.SHOW_LOGIN_MODAL)

  const { data: boughtProduct, isSuccess } = useQuery({
    queryKey: [productId, 'CHECK_BOUGHT'],
    queryFn: async () => {
      const { data: boughtProductData, status } = await $api.get(`/api/products/purchased/check/${productId}`)
      if (status > 201) return null
      return boughtProductData
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(isLoggedIn),
    retry: 1
  })

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [productId, 'FETCH_REVIEWS_PRODUCT', sort, checkImage],
    queryFn: async ({ pageParam }) => {
      const { data: reviews, status } = await $api.get(
        `/api/reviews/${productId}?page=${pageParam}&limit=${limit}&sort=${sort.value}${
          checkImage ? `&filter=checkImage` : ''
        }`
      )

      if (status !== 200) {
        return new Error('Ошибка получения заказов')
      }

      if (!hasReviews && reviews?.reviews?.length) {
        setHasReviews(!hasReviews)
      }

      return reviews
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.totalCount > allPages.length * limit) return true
      return lastPage.nextCursor
    },
    refetchOnWindowFocus: false
  })

  const toReviewPage = async () => {
    await router.push({
      pathname: `${routes.REVIEWS}/${productId}`,
      query: { mode: boughtProduct?.review ? 'edit' : 'create' }
    })
  }

  if (error) return null

  return (
    <article className={s.reviews}>
      <Text as='h1'>Отзывы</Text>
      <div className={s.reviews__container}>
        <section className={s.reviews_graph}>
          {isLoadingRating ? (
            <ReviewsRatingSkeleton />
          ) : ratingData ? (
            <ReviewsRating {...ratingData} />
          ) : (
            <Text>Для данного товара нету оценок</Text>
          )}
          {boughtProduct && isSuccess && isLoggedIn && (
            <div className={s.reviews_graph__add_comment}>
              <Button onClick={toReviewPage} style={{ width: '100%', padding: '16px' }}>
                {boughtProduct.review ? 'Редактировать отзыв' : 'Написать отзыв'}
              </Button>
            </div>
          )}
        </section>
        <section className={s.reviews__comment_block}>
          {hasReviews && (
            <div className={s.reviews__header}>
              <Select
                name='comment_sort'
                value={sort}
                onChange={setSort}
                options={sorList}
                suffixIcon='arrow-bottom'
                fluid={isSmall}
                disabled={isFetching}
              />
              <Checkbox
                onChange={(e) => setCheckImage(e.target.checked)}
                checked={checkImage}
                label='С фото'
                name='reviews_filter_image'
                disabled={isFetching}
              />
            </div>
          )}
          <div className={s.reviews__comments}>
            {!isFetching ? (
              data?.pages &&
              data?.pages?.map((group) =>
                group?.reviews?.length > 0 ? (
                  group?.reviews.map((c: IReview) => (
                    <div key={c._id} className={s.reviews__comment}>
                      <ProductReview {...c} handlerLoginModal={handlerLoginModal} isAuth={isLoggedIn} />
                    </div>
                  ))
                ) : (
                  <Text key={Math.random()} as='div'>
                    Для данного товара нету отзывов
                  </Text>
                )
              )
            ) : (
              <ProductReviewsSkeleton />
            )}
          </div>
          {hasNextPage && (
            <div className={s.reviews__comments_more} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? 'Загрузка...' : 'Показать еще'}
            </div>
          )}
        </section>
      </div>
    </article>
  )
}
