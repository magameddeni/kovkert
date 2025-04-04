import React from 'react'
import { IProduct } from '@/models'
import { ProductImage } from '@/components/product'
import { SwiperSlider, Thumbs, Pagination } from '@/components/UI/carousel/SwiperSlider'
import { AddToFavoritesButton } from '@/components/favorite'
import s from './slider_image.module.scss'

interface ISliderProps {
  addFavorite?: boolean
  product: IProduct
  handlerImageClick?: VoidFunction
}

const SliderImages = ({ product, handlerImageClick, addFavorite }: ISliderProps) => (
  <div className={s.slider}>
    {addFavorite && (
      <div className={s.slider__add_favorite}>
        <AddToFavoritesButton item={product} clickOutsideArea={16} />
      </div>
    )}

    <SwiperSlider modules={[Thumbs, Pagination]} watchSlidesProgress spaceBetween={10} slidesPerView={1} showPagination>
      {product.images.map(({ link }) => (
        <SwiperSlider.SwiperSlide key={link} className={s.slider__swiper_slider}>
          <ProductImage onClick={handlerImageClick} link={link} asLink={false} className={s.slider__slide_image} />
        </SwiperSlider.SwiperSlide>
      ))}
    </SwiperSlider>
  </div>
)

export default SliderImages
