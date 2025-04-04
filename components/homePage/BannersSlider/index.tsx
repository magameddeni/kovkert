import React, { FC } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { TBanner } from '@/models'
import { useWindowSize } from '@/hooks'
import { Autoplay, SwiperSlider, Thumbs } from '@/components/UI/carousel/SwiperSlider'
import s from './styles.module.scss'

interface TReturnGetImageOptions {
  width: number
  height: number
  image: 'mediumImage' | 'largeImage' | 'smallImage'
}

const BannersSlider: FC<{ banners: TBanner[] }> = ({ banners }) => {
  const { deviceWidth } = useWindowSize()
  const { push } = useRouter()

  const getImageOptions = (): TReturnGetImageOptions => {
    if (deviceWidth === 'small') return { width: 375, height: 180, image: 'smallImage' }
    if (deviceWidth === 'medium') return { width: 768, height: 260, image: 'mediumImage' }
    return { width: 1400, height: 400, image: 'largeImage' }
  }

  if (!deviceWidth) return null

  return (
    <div className={s.banners}>
      <SwiperSlider
        autoplay={{
          delay: 5000
        }}
        watchSlidesProgress
        modules={[Autoplay, Thumbs]}
        spaceBetween={10}
        slidesPerView={1}
        className='swiper'
        showPagination
      >
        {banners.map((slide: TBanner) => {
          const { width, height, image } = getImageOptions()

          return (
            <SwiperSlider.SwiperSlide key={slide._id} onClick={() => push(slide.link)} className={s.banners__slide}>
              <Image
                className={s.image}
                src={slide[image].link}
                width={width}
                height={height}
                objectFit='cover'
                layout='responsive'
                quality={90}
                placeholder='blur'
                blurDataURL='/dots-loader.svg'
                alt=''
              />
            </SwiperSlider.SwiperSlide>
          )
        })}
      </SwiperSlider>
    </div>
  )
}

export default BannersSlider
