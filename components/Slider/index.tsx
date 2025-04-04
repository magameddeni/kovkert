import React, { FC } from 'react'
import styles from './slider.module.scss'
import { SwiperSlider, Pagination, Thumbs, Navigation } from '../UI/carousel/SwiperSlider'

interface SliderInterface {
  slides: string[]
  handleClickSlide: (item: string) => void
}

const Slider: FC<SliderInterface> = ({ slides, handleClickSlide }) => (
  <div className={styles.productImageSliderWrapper}>
    <SwiperSlider
      direction='vertical'
      slidesPerView={4}
      spaceBetween={8}
      height={392}
      width={392}
      mousewheel
      modules={[Pagination, Thumbs, Navigation]}
      pagination={{
        dynamicBullets: true,
        dynamicMainBullets: 4
      }}
    >
      {slides.map((items: string) => (
        <SwiperSlider.SwiperSlide key={items} className={styles.slide} onClick={() => handleClickSlide(items)}>
          <img src={items} className={styles.slide_image} alt='' />
        </SwiperSlider.SwiperSlide>
      ))}
    </SwiperSlider>
  </div>
)

export default Slider
