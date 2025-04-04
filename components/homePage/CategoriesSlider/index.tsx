import React, { useMemo } from 'react'
import cx from 'classnames'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { routes } from '@/constants'
import { useWindowSize } from '@/hooks'
import { FreeMode, Navigation, SwiperSlider } from '@/components/UI/carousel/SwiperSlider'
import { HexagonalButton, Text } from '@/components/UI'
import image1 from '@/public/remove/categories-slider/0.png'
import image2 from '@/public/remove/categories-slider/1.png'
import image3 from '@/public/remove/categories-slider/2.png'
import image4 from '@/public/remove/categories-slider/3.png'
import image5 from '@/public/remove/categories-slider/4.png'
import s from './categories.module.scss'

interface SliderItem {
  title: string
  image: string | StaticImageData
  link: string
}

const sliderItems: SliderItem[] = [
  {
    title: 'Электроинструмент',
    image: image1,
    link: `${routes.CATEGORY}/63fe36d8b6a80deaf3c4e93b`
  },
  {
    title: 'Лакокрасочные материалы',
    image: image2,
    link: `${routes.CATEGORY}/63fe36d8b6a80deaf3c4e914`
  },
  {
    title: 'Сухие строительные смеси',
    image: image3,
    link: `${routes.CATEGORY}/63fe36d8b6a80deaf3c4e93a`
  },
  {
    title: 'Ручной инструмент',
    image: image4,
    link: `${routes.CATEGORY}/63fe36d8b6a80deaf3c4e949`
  },
  {
    title: 'Розетки и выключатели',
    image: image5,
    link: `${routes.CATEGORY}/63fe36d8b6a80deaf3c4e961`
  }
]

const CategoriesSlider = () => {
  const { size } = useWindowSize()

  const largeHexagonalButtonSize = useMemo(() => size === 'xl' || size === 'xxl', [size])

  return (
    <SwiperSlider
      className={s.slider}
      modules={[Navigation, FreeMode]}
      breakpoints={{
        320: {
          slidesPerView: 'auto',
          spaceBetween: 16
        },
        375: {
          slidesPerView: 'auto',
          spaceBetween: 16
        },
        576: {
          slidesPerView: 'auto',
          spaceBetween: 16
        },
        768: {
          slidesPerView: 'auto',
          spaceBetween: 16
        },
        1024: {
          slidesPerView: 'auto',
          spaceBetween: 20
        },
        1400: {
          slidesPerView: 5,
          spaceBetween: 20
        }
      }}
    >
      <SwiperSlider.SwiperSlide key='affiliate' className={cx(s['category-slider'], s['affiliate-slider'])}>
        <Link href={routes.AFFILIATE}>
          <HexagonalButton small={!largeHexagonalButtonSize} fluid={largeHexagonalButtonSize}>
            {'Партнерская\nпрограмма'}
          </HexagonalButton>
        </Link>
      </SwiperSlider.SwiperSlide>
      {sliderItems.map((v) => (
        <SwiperSlider.SwiperSlide key={v.title} className={s['category-slider']}>
          <Link href={v.link} className={s['category-slider__link']}>
            <Text size='sm' family='secondary' className={s['category-slider__label']}>
              {v.title}
            </Text>
            <Image src={v.image} width={100} height={80} className={s['category-slider__img']} alt='' />
          </Link>
        </SwiperSlider.SwiperSlide>
      ))}
    </SwiperSlider>
  )
}

export default CategoriesSlider
