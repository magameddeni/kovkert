import React, { PropsWithChildren, useState } from 'react'
import * as Modules from 'swiper'
import { Controller } from 'swiper'
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react'
import { ArrowIcon } from '@/components/UI'
import cx from 'classnames'
import SliderPagination from '../SliderPagination'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import s from './style.module.scss'

interface SwiperSliderProps extends SwiperProps, PropsWithChildren {
  showPagination?: boolean
  prevArrow?: boolean
  nextArrow?: boolean
  prevArrowClassName?: string
  nextArrowClassName?: string
  arrowView?: 'product' | undefined
}

const SwiperSlider: React.FC<SwiperSliderProps> = ({
  children,
  showPagination,
  prevArrow,
  nextArrow,
  prevArrowClassName,
  nextArrowClassName,
  arrowView,
  modules = [],
  ...rest
}) => {
  const [swiper, setSwiper] = useState<any>(null)
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)

  return (
    <div className={s.slider}>
      {prevArrow && (
        <ArrowIcon
          arrow='left'
          onClick={() => swiper?.slidePrev?.()}
          className={cx({ [s[`arrow-view-${arrowView}`]]: arrowView }, s['arrow-prev'], prevArrowClassName)}
        />
      )}
      <Swiper
        onSwiper={setSwiper}
        // controller={{ control: swiper }}
        thumbs={{
          swiper: thumbsSwiper,
          slideThumbActiveClass: 'active_item',
          multipleActiveThumbs: true
        }}
        modules={[Controller, ...modules]}
        {...rest}
      >
        {children}
        {showPagination && <SliderPagination type='products' setThumbsSwiper={setThumbsSwiper} />}
      </Swiper>
      {nextArrow && (
        <ArrowIcon
          arrow='right'
          onClick={() => swiper?.slideNext?.()}
          className={cx({ [s[`arrow-view-${arrowView}`]]: arrowView }, s['arrow-next'], nextArrowClassName)}
        />
      )}
    </div>
  )
}

export default Object.assign(SwiperSlider, {
  SwiperSlide,
  ...Modules
})
