import SwiperType from 'swiper'

export interface TSliderPaginationProps {
  type: 'banners' | 'products' | 'product_images'
  setThumbsSwiper?: (payload: TSwiperType) => void
}

export interface TSwiperType extends SwiperType {
  visibleSlidesIndexes?: number[]
  params: any
  progress: number
}
