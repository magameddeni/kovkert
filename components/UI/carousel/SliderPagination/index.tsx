import React, { useState } from 'react'
import cx from 'classnames'
import { useSwiper } from 'swiper/react'
import { TSwiperType, TSliderPaginationProps } from './types'
import s from './style.module.scss'

const SliderPagination: React.FC<TSliderPaginationProps> = ({ type = 'products' }) => {
  const swiper: TSwiperType = useSwiper()
  const [delay] = useState(swiper?.params?.autoplay?.delay)
  const [visibleSlidesIndexes, setVisibleSlidesIndexes] = useState(swiper.visibleSlidesIndexes ?? [])
  const handleChange = (e: TSwiperType) => setVisibleSlidesIndexes(e.visibleSlidesIndexes ?? [])

  React.useEffect(() => {
    swiper.on('transitionEnd', handleChange)
    swiper.on('update', handleChange)
    return () => {
      swiper.off('update', handleChange)
      swiper.off('transitionEnd', handleChange)
    }
  }, [])

  if (swiper.slides.length <= 1) return null
  if ((swiper.visibleSlidesIndexes?.length ?? 0) >= swiper.slides.length) return null

  return (
    <div
      className={cx(s.pagination, {
        [s[`pagination__type-${type}`]]: type
      })}
    >
      <div className={s.pagination__list}>
        {Array.from({ length: swiper.slides.length }).map((_, index) => (
          <span
            key={Math.random()}
            onClick={() => swiper.slideTo(index)}
            className={cx(s.pagination__item, {
              [s['pagination__item-active']]: !delay && visibleSlidesIndexes?.includes(index),
              [s[`pagination__item-${delay}`]]: delay && visibleSlidesIndexes?.includes(index)
            })}
          />
        ))}
      </div>
    </div>
  )
}

export default SliderPagination
