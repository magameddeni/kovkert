import React, { FC } from 'react'
import { Icon, Text } from '@/components/UI'
import cn from 'classnames'
import { IReviewReply, IReviewShop } from '@/models'
import { useLikeCount } from '@/hooks/useLikeCount'
import useTimeHook from '@/components/Hooks/useTimeHook'
import Image from 'next/image'
import s from './style.module.scss'

interface IReviewReplyProps extends IReviewReply {
  shop: IReviewShop
  mutate: (payload: any) => void
}

const ReviewReply: FC<IReviewReplyProps> = ({
  createdAt,
  text,
  dislikeCount,
  likeCount,
  like,
  dislike,
  shop,
  mutate
}) => {
  const { dayLong, monthLong, yearLong } = useTimeHook(createdAt)

  const { currentDislike, currentLike, currentDislikeCount, currentLikeCount, successLikeInteractHandler } =
    useLikeCount({
      dislikeCount,
      dislike,
      likeCount,
      like
    })

  return (
    <div className={s.reply}>
      <div className={s.reply__answer}>
        <Icon name='answer' />
      </div>
      <div className={s.reply__shop_avatar}>
        <Image width={36} height={36} src={shop.image} alt={shop.name} />
      </div>
      <div className={s.reply__content}>
        <Text weight='medium' as='div'>
          {shop.name}
        </Text>
        <Text weight='regular' as='div' className='offset-top-4'>
          {dayLong} {monthLong} {yearLong}
        </Text>
        <Text as='div' className='offset-top-16'>
          {text}
        </Text>
        <div className={s.reply__footer}>
          <div
            onClick={() => mutate({ type: 'like', isReply: true, updateLikeCount: successLikeInteractHandler })}
            className={cn(s.reply__footer_item, {
              'reply__footer_like-active': currentLike
            })}
          >
            <Icon name='like' color={currentLike ? 'primary' : 'gray'} />
            {currentLikeCount}
          </div>
          <div
            onClick={() => mutate({ type: 'dislike', isReply: true, updateLikeCount: successLikeInteractHandler })}
            className={cn(s.reply__footer_item, {
              'reply__footer_dislike-active': currentDislike
            })}
          >
            <Icon name='dislike' color={currentDislike ? 'red' : 'gray'} />
            {currentDislikeCount}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewReply
