import React from 'react'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAppSelector } from '@/redux/hook'
import { useMessage } from '@/hooks'
import { meta, routes } from '@/constants'
import { IReviewCard, IReviewForm } from '@/models'
import { Container, DotsLoader } from '@/components/UI'
import { ReviewContent } from '@/components/Reviews/Page/ReviewContent'
import { FeedbackSuccess } from '@/components/Reviews/Page/FeedbackSuccess'
import $api from '@/components/Http/axios'
import Layout from '@/components/layout/Main'
import Error404 from '@/components/404Page/404'

export const getServerSideProps = (ctx: NextPageContext) => {
  const id = ctx.query.slug

  return {
    props: {
      id
    }
  }
}

const ReviewsPage = ({ id }: { id: string }) => {
  const { query, push } = useRouter()
  const isAuth = useAppSelector(({ beru }) => beru.user.isLoggedIn)
  const isCreate = query.mode === 'create'
  const isEdit = query.mode === 'edit'

  const formikInitialValues = {
    value: 0,
    deficiencies: '',
    advantages: '',
    comment: '',
    anonym: false,
    images: []
  }

  const {
    data: product,
    error,
    isFetched
  } = useQuery({
    queryFn: async () => {
      if (!isAuth) return useMessage('Ошибка.Необходимо авторизоваться!')
      const { data, status } = await $api.get(`/api/products/purchased/check/${id}`)
      if (status > 201) useMessage('Ошибка.Не удалось получить товар!', 'error')
      return data
    },
    queryKey: ['GET-PRODUCT-FOR-REVIEW-PAGE', id]
  })

  const { mutate: editReview, isPending: isPendingEditReview } = useMutation({
    mutationFn: async ({ images, values }: any) => {
      if (!product) return null
      const { data, status } = await $api.patch(`/api/reviews/products/${id}/reviews/${values._id}`, {
        ...values,
        images
      })
      if (status !== 200) return useMessage('Ошибка.Не удалось изменить отзыв!', 'error')
      return data
    },
    onSuccess: () => push(`${routes.REVIEWS}/${id}`),
    onError: ({ message }: any) => useMessage(message, 'error')
  })

  const { mutate: createReview, isPending: isPendingCreateReview } = useMutation({
    mutationFn: async ({ images, values }: any) => {
      if (!product) return null
      const { data, status } = await $api.post(`/api/reviews/products/${product._id}`, { ...values, images })
      if (status !== 201) return useMessage('Ошибка.Не удалось оставить отзыв!')
      return data
    },
    onSuccess: () => push(`${routes.REVIEWS}/${id}`),
    onError: ({ message }: any) => useMessage(message, 'error')
  })

  const deleteImages = async (images: string[]) => {
    await $api.delete(`/api/reviews/images/${id}?filenames=${images.join(',')}`)
  }

  const formikSubmitHandler = async (values: IReviewForm, images?: string[]) => {
    if (isEdit) {
      const removedImages = product.review.images.filter((v: string) => !images?.includes(v))
      if (removedImages?.length) {
        await deleteImages(removedImages.map((v: string) => v.split(`${routes.REVIEWS}/`)[1]))
      }

      return editReview({ values, images })
    }

    createReview({ values, images })
  }

  const { mutate: uploadImages } = useMutation({
    mutationFn: async ({ files, values, prevImages }: { files: File[]; values: any; prevImages: string[] }) => {
      const { data, status } = await $api.post(`/api/reviews/images/${id}`, files, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (status !== 201)
        return useMessage(isCreate ? 'Ошибка.Не удалось оставить отзыв!' : 'Ошибка.Не удалось изменить отзыв!', 'error')

      return { images: data, values, prevImages }
    },
    onSuccess: (data) => {
      if (typeof data === 'object') formikSubmitHandler(data?.values, [...data.images, ...data.prevImages])
    },
    onError: ({ message }: any) => useMessage(message, 'error')
  })

  if (!isFetched) {
    return (
      <Layout meta={{ ...meta.REVIEWS_SLUG }}>
        <Container style={{ marginTop: '100px' }}>
          <DotsLoader />
        </Container>
      </Layout>
    )
  }

  if (!isAuth) {
    return (
      <Layout meta={{ ...meta.ERROR_PAGE('Необходимо авторизоваться') }}>
        <Container>
          <Error404 />
        </Container>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout meta={{ ...meta.ERROR_PAGE('Отзыв не найден') }}>
        <Container>
          <Error404 />
        </Container>
      </Layout>
    )
  }

  if ((isCreate && !product?.review) || (isEdit && product?.review)) {
    return (
      <ReviewContent
        data={isCreate ? formikInitialValues : (product?.review as IReviewCard)}
        product={product}
        uploadImages={uploadImages}
        onSubmit={formikSubmitHandler}
        mode={query.mode as 'create' | 'edit'}
        isLoading={isPendingCreateReview || isPendingEditReview}
      />
    )
  }

  return (
    <Layout meta={{ ...meta.REVIEWS_SLUG }}>
      <Container>
        <FeedbackSuccess />
      </Container>
    </Layout>
  )
}

export default ReviewsPage
