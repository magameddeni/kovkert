import React from 'react'
import Swiper from 'swiper'
import { useSwiper } from 'swiper/react'

const SwiperController: React.FC<{ setState: (payload: Swiper) => void }> = ({ setState }) => {
  setState(useSwiper())
  return null
}

export default SwiperController
