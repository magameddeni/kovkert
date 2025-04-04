import React, { FC, useState } from 'react'
import { IReview } from '@/models'
import { useLikeCount } from '@/hooks/useLikeCount'
import { Icon, Text, GalleryViewer } from '@/components/UI'
import classNames from 'classnames/bind'
import useTimeHook from '@/components/Hooks/useTimeHook'
import ReviewReply from '@/components/Reviews/ReviewReply/ReviewReply'
import StarRating from '@/components/StarRating/StarRating'
import { ProductImage } from '@/components/product'
import { useMutation } from '@tanstack/react-query'
import $api from '@/components/Http/axios'
import { useMessage } from '@/hooks'
import s from './product_comment.module.scss'

const cn = classNames.bind(s)

interface ICommentProps extends IReview {
  isAuth?: boolean
  handlerLoginModal: () => void
  successLikeInteractHandler?: VoidFunction
}

export const ProductReview: FC<ICommentProps> = ({
  _id,
  reviewer,
  value,
  createdAt,
  comment,
  advantages,
  deficiencies,
  images,
  likeCount,
  dislikeCount,
  like,
  dislike,
  isAuth,
  handlerLoginModal,
  reply,
  shop
}) => {
  const [showGallery, setShowGallery] = useState<{ show: boolean; card?: any; index: number }>({
    show: false,
    index: 0
  })
  const { day, monthLong, yearLong, hour, minute } = useTimeHook(createdAt)
  const { currentDislike, currentLike, currentDislikeCount, currentLikeCount, successLikeInteractHandler } =
    useLikeCount({
      dislikeCount,
      dislike,
      likeCount,
      like
    })

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
      if (!isAuth) return handlerLoginModal()
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

  return (
    <div className={s.comment}>
      <div className={s.comment__header}>
        <Text className={s.comment__user} family='secondary'>
          {!reviewer.lastName && !reviewer.name
            ? 'Пользователь скрыл свои данные'
            : ` ${reviewer.lastName} ${reviewer.name}`}
        </Text>

        <div className={s.comment__review}>
          <div className={s.comment__review_stars}>
            <StarRating
              maxStars={5}
              emptyColor='#DADCE6'
              activeColor='#FFA32D'
              width={16}
              height={16}
              defaultState={value}
              onChangeHover={() => {}}
              onChangeValue={() => {}}
              readOnly
            />
          </div>
          <div className={s.comment__review_date}>
            {day} {monthLong} {yearLong} {`${hour}:${minute}`}
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <div className={s.comment__images}>
          {images.map((image, index) => (
            <ProductImage
              key={image}
              onClick={() => openGallery(index)}
              asLink={false}
              className={s.comment__image}
              link={image}
              fit='cover'
            />
          ))}
        </div>
      )}
      {(advantages || deficiencies || comment) && (
        <div className={s.comment__text}>
          {advantages && (
            <div className={s.comment__advantages_section}>
              <Text className={s.comment__section_title}>Достоинства</Text>
              <div className={s.comment__advantages_text}>{advantages}</div>
            </div>
          )}
          {deficiencies && (
            <div className={s.comment__disadvantages_section}>
              <Text className={s.comment__section_title}>Недостатки</Text>
              <div className={s.comment__disadvantages_text}>{deficiencies}</div>
            </div>
          )}
          {comment && (
            <div className={s.comment__discription_section}>
              <Text className={s.comment__section_title}>Комментарий</Text>
              <div className={s.comment__discription_text}>{comment}</div>
            </div>
          )}
        </div>
      )}
      <div className={s.comment__footer}>
        <div
          onClick={() => mutate({ type: 'like', updateLikeCount: successLikeInteractHandler })}
          className={cn({
            comment__footer_item: true,
            comment__footer_like: true,
            'comment__footer_like-active': currentLike
          })}
        >
          <Icon name='like' color={currentLike ? 'primary' : 'gray'} />
          {currentLikeCount}
        </div>
        <div
          onClick={() => mutate({ type: 'dislike', updateLikeCount: successLikeInteractHandler })}
          className={cn({
            comment__footer_item: true,
            comment__footer_dislike: true,
            'comment__footer_dislike-active': currentDislike
          })}
        >
          <Icon name='dislike' color={currentDislike ? 'red' : 'gray'} />
          {currentDislikeCount}
        </div>
      </div>
      {reply?.text && <ReviewReply mutate={mutate} shop={shop[0]} {...reply} />}

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
