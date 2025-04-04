import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import cn from 'classnames'
import { routes } from '@/constants'
import { IReview } from '@/models'
import { useMessage } from '@/hooks'
import { Icon, Modal, Text, Tooltip, GalleryViewer } from '@/components/UI'
import { ProductImage } from '@/components/product'
import { useLikeCount } from '@/hooks/useLikeCount'
import { useMutation } from '@tanstack/react-query'
import useTimeHook from '@/components/Hooks/useTimeHook'
import StarRating from '@/components/StarRating/StarRating'
import $api from '@/components/Http/axios'
import DeleteReview from '../Modal/DeleteReview'
import s from './style.module.scss'
import ReviewReply from '../ReviewReply/ReviewReply'

interface ReviewBlockProps extends IReview {}

const ReviewBlock: FC<ReviewBlockProps> = ({
  productCard,
  createdAt,
  value,
  advantages,
  deficiencies,
  comment,
  images,
  _id,
  reply,
  likeCount,
  dislikeCount,
  like,
  dislike,
  shop
}) => {
  const [deleteReviewModal, setDeleteReviewModal] = useState(false)
  const { currentDislike, currentLike, currentDislikeCount, currentLikeCount, successLikeInteractHandler } =
    useLikeCount({
      dislikeCount,
      dislike,
      likeCount,
      like
    })

  const [showGallery, setShowGallery] = useState<{ show: boolean; card?: any; index: number }>({
    show: false,
    index: 0
  })
  const { push } = useRouter()
  const { dayLong, monthLong, yearLong } = useTimeHook(createdAt)

  const { mutate } = useMutation({
    mutationFn: async ({
      type,
      isReply,
      updateLikeCount
    }: {
      type: 'like' | 'dislike'
      isReply?: true
      updateLikeCount?: (props: 'like' | 'dislike') => void
    }) => {
      const { data, status } = await $api.post(`/api/reviews/${_id}/interact`, {
        type,
        replyId: isReply ? reply._id : null
      })
      if (status !== 200) return useMessage(`Не удалось оценить комментарий`, 'error')
      updateLikeCount?.(type)

      return data
    }
  })

  const openGallery = (index: number) => {
    const convertReviewImage = images.map((link) => ({ link }))
    setShowGallery({ card: { images: convertReviewImage }, show: true, index: index ?? 0 })
  }

  const onRequestCloseDeleteModal = () => {
    setDeleteReviewModal(false)
  }

  const deleteReview = async () => {
    try {
      const { status } = await $api.delete(`/api/reviews/${_id}`)
      if (status === 200) {
        useMessage(`Отзыв на товар "${productCard[0].productName}" успешно удален`)
        onRequestCloseDeleteModal()
      }
    } catch (error: any) {
      useMessage(error?.message, 'error')
    }
  }

  if (!productCard || !productCard?.length) return null

  const renderTooltip = (
    <Tooltip className={s.tooltip}>
      <Text
        as='div'
        className={s.tooltip__item}
        onClick={() => push(`${routes.REVIEWS}/${productCard[0]._id}?mode=edit`)}
      >
        <Icon name='edit' />
        Изменить
      </Text>
      <Text as='div' className={s.tooltip__item} color='red' onClick={() => setDeleteReviewModal(true)}>
        <Icon color='red' name='basket' />
        Удалить
      </Text>
    </Tooltip>
  )

  return (
    <div className={s.block}>
      <div className={s.block__head}>
        <ProductImage
          id={productCard[0]?._id as string}
          className={s.block__product_image}
          link={productCard.length ? productCard[0]?.images[0]?.link : ''}
        />
        <div>
          <Text as='div' className={s.block__date_rating}>
            <StarRating
              maxStars={5}
              emptyColor='#EAECF2'
              activeColor='#FFA32D'
              defaultState={value}
              height={16}
              width={16}
              readOnly
            />
            {dayLong} {monthLong} {yearLong}
          </Text>
          <Link href={`${routes.PRODUCT}/${productCard[0]?._id}`}>
            <Text as='p' className='offset-top-8' weight='medium'>
              {productCard.length ? productCard[0].productName : 'Карточка товара удалена'}
            </Text>
          </Link>
        </div>

        <div className={s.block__large_tooltip}>{renderTooltip}</div>
      </div>
      {Boolean(images.length) && (
        <div
          className={cn(s.block__images, {
            [s['block__images-offset-bottom']]: !advantages?.length && !deficiencies?.length && !comment?.length
          })}
        >
          {images.map((f, i) => (
            <ProductImage asLink={false} onClick={() => openGallery(i)} className={s.block__image} link={f} />
          ))}
        </div>
      )}
      {Boolean(advantages?.length) && (
        <>
          <Text weight='medium' className='offset-top-16' as='div'>
            Достоинства
          </Text>
          <Text className='offset-top-4' as='div'>
            {advantages}
          </Text>
        </>
      )}
      {Boolean(deficiencies?.length) && (
        <>
          <Text weight='medium' className='offset-top-16' as='div'>
            Недостатки
          </Text>
          <Text className='offset-top-4' as='div'>
            {deficiencies}
          </Text>
        </>
      )}
      {Boolean(comment?.length) && (
        <>
          <Text weight='medium' className='offset-top-16' as='div'>
            Комменарий
          </Text>
          <Text className='offset-top-4' as='div'>
            {comment}
          </Text>
        </>
      )}
      <div className={s.block__footer}>
        <div className={s.block__like_dislike}>
          <div
            className={s.block__like}
            onClick={() => mutate({ type: 'like', updateLikeCount: successLikeInteractHandler })}
          >
            <Icon name='like' color={currentLike ? 'primary' : 'gray'} />
            <Text weight='medium' color='gray'>
              {currentLikeCount}
            </Text>
          </div>
          <div
            className={s.block__dislike}
            onClick={() => mutate({ type: 'dislike', updateLikeCount: successLikeInteractHandler })}
          >
            <Icon name='dislike' color={currentDislike ? 'red' : 'gray'} />
            <Text weight='medium' color='gray'>
              {currentDislikeCount}
            </Text>
          </div>
        </div>
        <div className={s.block__small_tooltip}>{renderTooltip}</div>
      </div>

      {reply.text && reply.createdAt && <ReviewReply shop={shop[0]} mutate={mutate} {...reply} />}

      <Modal size='sm' isOpen={deleteReviewModal} onRequestClose={onRequestCloseDeleteModal}>
        <DeleteReview onCLose={onRequestCloseDeleteModal} onDelete={deleteReview} />
      </Modal>

      {showGallery.show && (
        <GalleryViewer
          card={showGallery.card}
          currentSlideIndex={showGallery.index}
          onCloseGallery={() => setShowGallery({ show: false, index: 0 })}
        />
      )}
    </div>
  )
}

export default ReviewBlock
