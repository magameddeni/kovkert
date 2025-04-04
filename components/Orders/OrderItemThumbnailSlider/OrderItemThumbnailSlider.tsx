import React from 'react'
import { IOrderGroupOrderItem } from '@/models'
import { Pagination, SwiperSlider } from '@/components/UI/carousel/SwiperSlider'
import OrderItemThumbnail from '../OrderItemThumbnail/OrderItemThumbnail'
import s from './slider.module.scss'

interface ProductsSliderProps {
  items: IOrderGroupOrderItem[]
}

const OrderProductsSlider: React.FC<ProductsSliderProps> = ({ items }) => (
  <div className={s.slider}>
    <SwiperSlider
      slidesPerView='auto'
      spaceBetween={8}
      pagination={{
        clickable: true
      }}
      modules={[Pagination]}
    >
      {items.map((v: IOrderGroupOrderItem) => (
        <SwiperSlider.SwiperSlide key={v._id} className={s.slider__slide} style={{ maxWidth: '80px' }}>
          <OrderItemThumbnail item={v} />
        </SwiperSlider.SwiperSlide>
      ))}
    </SwiperSlider>
  </div>
)

export default OrderProductsSlider
