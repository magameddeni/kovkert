import React, { PropsWithChildren } from 'react'
import { SwiperOptions } from 'swiper'
import { Swiper } from 'swiper/react'

interface OfferSliderProps extends PropsWithChildren {
  breakpoints: {
    [width: number]: SwiperOptions
    [ratio: string]: SwiperOptions
  }
  slidesPerView?: 'auto' | number
}

const OfferSlider: React.FC<OfferSliderProps> = ({ breakpoints, children, ...props }) => (
  <Swiper watchSlidesProgress breakpoints={breakpoints} {...props}>
    {children}
  </Swiper>
)

export default OfferSlider
