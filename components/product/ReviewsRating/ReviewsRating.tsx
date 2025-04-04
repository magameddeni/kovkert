import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames/bind'
import { Icon } from '@/components/UI'
import { ReviewsRatingData } from './model'
import s from './ratings_chart.module.scss'

const cn = classNames.bind(s)

export const ReviewsRating: React.FC<ReviewsRatingData> = ({
  one = 0,
  two = 0,
  three = 0,
  four = 0,
  five = 0,
  totalCount,
  average
}) => {
  const refLine = useRef<HTMLDivElement>(null)
  const [offsetWidth, setOffsetWidth] = useState(refLine.current?.offsetWidth ?? 214)

  const numberReviewsList: { rating: number; count: number }[] = [
    { rating: 5, count: five },
    { rating: 4, count: four },
    { rating: 3, count: three },
    { rating: 2, count: two },
    { rating: 1, count: one }
  ]

  useEffect(() => {
    setOffsetWidth(refLine.current?.offsetWidth ?? 214)
  }, [refLine.current])

  const progressLineWidth = (index: number) => (offsetWidth / totalCount) * numberReviewsList[index].count

  return (
    <div className={s.graph}>
      <div className={s.graph__info}>
        <div className={s.graph__rating}>
          <Icon size='xxl' name='star' color='orange' />
          <div className={s.graph__rating_text}>{average.toFixed(1)}</div>
        </div>
        <div className={s.graph__number_reviews}>{totalCount} отзыва</div>
      </div>
      <div className={s.graph__reviews}>
        {numberReviewsList.map((item, index) => (
          <div
            className={cn({
              graph__reviews_item: true,
              'graph__list_item-active': item.count > 0
            })}
            key={JSON.stringify(item)}
          >
            <div className={s.graph__reviews_value}>
              <Icon size='xxl' name='star' color={item.count > 0 ? 'orange' : 'gray'} />
              {item.rating}
            </div>
            <div className={s.graph__reviews_line} ref={refLine}>
              <span style={{ width: progressLineWidth(index) }} className={s.graph__reviews_bg} />
            </div>
            <div className={s.graph__reviews_count}>{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
