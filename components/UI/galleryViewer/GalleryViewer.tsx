import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { IProduct } from '@/models'
import { useCloseOnEsc, useWindowSize } from '@/hooks'
import { Icon, ArrowIcon } from '@/components/UI'
import { SwiperSlider, FreeMode, Navigation, Thumbs, Pagination } from '@/components/UI/carousel/SwiperSlider'
import { ProductImage } from '@/components/product'
import { TSwiperType } from '@/components/UI/carousel/SliderPagination/types'
import s from './gallery-viewer.module.scss'

interface IGalleryViewerProps {
  card: IProduct
  currentSlideIndex: number
  onCloseGallery: VoidFunction
}

const GalleryViewer = ({ card, currentSlideIndex, onCloseGallery }: IGalleryViewerProps) => {
  const [swiper, setSwiper] = useState<any>(null)
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  const [activeSlideIndex, setActiveSlideIndex] = useState(thumbsSwiper?.activeIndex ?? 0)
  const { isLarge, isMedium, isSmall } = useWindowSize()

  useCloseOnEsc(onCloseGallery)

  const gallerySlidersLength = card.images.length
  const hasGalleryArrows = gallerySlidersLength > 1

  const prevSlide = () => thumbsSwiper?.slidePrev()
  const nextSlide = () => thumbsSwiper?.slideNext()

  const handleChangeSwiper = (e: TSwiperType) => setActiveSlideIndex(e?.activeIndex ?? 0)

  useEffect(() => {
    if (thumbsSwiper) {
      thumbsSwiper?.on('transitionEnd', handleChangeSwiper)
      return () => thumbsSwiper?.off('transitionEnd', handleChangeSwiper)
    }
  }, [thumbsSwiper])

  if (!isLarge && !isMedium && !isSmall) return null

  return ReactDOM.createPortal(
    <div className={s.gallery}>
      <div onClick={onCloseGallery} className={s['gallery__close-button']}>
        <Icon name='close' color='gray-dark' />
      </div>
      <div className={s.gallery__content}>
        <div className={s.thumbs}>
          <SwiperSlider
            direction={isLarge ? 'vertical' : 'horizontal'}
            initialSlide={currentSlideIndex}
            onSwiper={setSwiper}
            spaceBetween={isLarge ? 16 : 12}
            slidesPerView='auto'
            watchSlidesProgress
            slideToClickedSlide
            centeredSlides={isSmall}
            centerInsufficientSlides={isLarge}
            modules={[FreeMode, Thumbs]}
            freeMode
          >
            {card.images.map((items) => (
              <SwiperSlider.SwiperSlide
                key={items._id}
                style={{
                  width: isSmall ? '60px' : isMedium ? '75px' : '92px',
                  height: isSmall ? '60px' : isMedium ? '75px' : '92px'
                }}
              >
                <ProductImage link={items.link} asLink={false} className={s.thumbs__img} />
              </SwiperSlider.SwiperSlide>
            ))}
          </SwiperSlider>
        </div>
        <SwiperSlider
          pagination
          onSwiper={setThumbsSwiper}
          className={s['gallery-image']}
          initialSlide={currentSlideIndex}
          modules={[FreeMode, Navigation, Thumbs, Pagination]}
          thumbs={{
            swiper: swiper && !swiper.destroyed ? swiper : null
          }}
        >
          {hasGalleryArrows && <ArrowIcon arrow='left' onClick={prevSlide} disabled={!activeSlideIndex} />}
          {card.images.map((items) => (
            <SwiperSlider.SwiperSlide key={items._id}>
              <div className={s['gallery-image__img-wrapper']}>
                <ProductImage link={items.link} asLink={false} className={s.thumbs__img} initBackground />
              </div>
            </SwiperSlider.SwiperSlide>
          ))}
          {hasGalleryArrows && (
            <ArrowIcon arrow='right' onClick={nextSlide} disabled={gallerySlidersLength === activeSlideIndex + 1} />
          )}
        </SwiperSlider>
      </div>
    </div>,
    document.getElementById('__next') as any
  )
}

export default GalleryViewer
