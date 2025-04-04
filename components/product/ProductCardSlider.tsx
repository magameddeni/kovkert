import React, { FC } from 'react'
import { IProduct } from '@/models'
import { useWindowSize } from '@/hooks'
import { ProductItem } from '@/components/product'
import { Pagination, SwiperSlider, Thumbs } from '../UI/carousel/SwiperSlider'

interface ProductCardSliderProps {
  slidesPerView: number
  spaceBetween?: number
  slides: IProduct[]
}

export const ProductCardSlider: FC<ProductCardSliderProps> = ({ slidesPerView, spaceBetween = 20, slides = [] }) => {
  const { isLarge } = useWindowSize()

  return (
    <SwiperSlider
      modules={[Thumbs, Pagination]}
      spaceBetween={spaceBetween as number}
      slidesPerView={slidesPerView}
      prevArrow={isLarge}
      nextArrow={isLarge}
      arrowView='product'
      watchSlidesProgress
      showPagination
    >
      {slides.map((card) => (
        <SwiperSlider.SwiperSlide key={card._id}>
          <ProductItem product={card} />
        </SwiperSlider.SwiperSlide>
      ))}
    </SwiperSlider>
  )
}
