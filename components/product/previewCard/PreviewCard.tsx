import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { FreeMode, Navigation, Pagination, SwiperSlider, Thumbs } from '@/components/UI/carousel/SwiperSlider'
import { routes } from '@/constants'
import { IProduct } from 'models'
import { useWindowSize } from 'hooks'
import { ProductImage } from 'components/product'
import { Button, Modal, Text } from 'components/UI'
import ProductCharacteristics from 'components/ProductPage/ProductCharacteristics'
import SliderImages from 'components/SliderImages/SliderImages'
import s from './preview-card.module.scss'

interface IPreviewCardProps {
  data: IProduct | undefined
  isOpen: boolean
  onClose: VoidFunction
}

export const PreviewCard = ({ data, isOpen, onClose }: IPreviewCardProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  const { isLarge } = useWindowSize()
  const router = useRouter()

  const handleDetailsProduct = () => {
    if (data?._id) {
      onClose()
      void router.push(`${routes.PRODUCT}/${data._id}`)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      size={isLarge ? 'lg' : 'sm'}
      closePlace='uptop-right'
      contentWrapperClassName={s['preview-card-modal-content-wrapper']}
    >
      {data ? (
        <div className={s['preview-card']}>
          <Text as='h1'>{data.productName}</Text>
          <div className={s.content}>
            <div className={s.content__image_block}>
              {isLarge && (
                <div className={s.content__slider}>
                  <div>
                    <SwiperSlider
                      direction='vertical'
                      initialSlide={0}
                      onSwiper={setThumbsSwiper}
                      spaceBetween={6}
                      slidesPerView='auto'
                      freeMode
                      watchSlidesProgress
                      slideToClickedSlide
                      modules={[FreeMode, Thumbs]}
                    >
                      {data.images.slice(0, 4).map((image) => (
                        <SwiperSlider.SwiperSlide
                          key={image._id}
                          style={{
                            width: '92px',
                            height: '92px'
                          }}
                        >
                          <div key={image._id} className={s.content__slider_item}>
                            <ProductImage link={image.link} asLink={false} className={s.content__slider_image} />
                          </div>
                        </SwiperSlider.SwiperSlide>
                      ))}
                    </SwiperSlider>
                  </div>
                  {data.images.length > 4 && (
                    <div className={s.content__image_more}>
                      <span className={s['content__image_more-text']}>Еще {data?.images.length - 3}</span>
                    </div>
                  )}
                </div>
              )}
              {!isLarge ? (
                <SliderImages key={data?._id} product={data as IProduct} />
              ) : (
                <SwiperSlider
                  initialSlide={0}
                  mousewheel={false}
                  allowTouchMove={false}
                  thumbs={{
                    swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
                  }}
                  modules={[FreeMode, Navigation, Thumbs, Pagination]}
                  pagination
                >
                  {data?.images.map((items) => (
                    <SwiperSlider.SwiperSlide key={items._id}>
                      <ProductImage link={items.link} asLink={false} className={s.content__image} />
                    </SwiperSlider.SwiperSlide>
                  ))}
                </SwiperSlider>
              )}
            </div>
            <div className={s.content__info_block}>
              <Text size='md'>{data?.description}</Text>
              {isLarge && (
                <div className='offset-top-24'>
                  <ProductCharacteristics count={data.characteristics.length} data={data.characteristics} />
                </div>
              )}
              <Button className={s['content__to-product-button']} fluid={!isLarge} onClick={handleDetailsProduct}>
                Подробнее на странице товара
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Modal>
  )
}
