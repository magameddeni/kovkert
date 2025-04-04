import React, { useEffect, useState } from 'react'
import { IProduct, TOfferCategoriesList } from '@/models'
import { Button, Text } from '@/components/UI'
import { ProductItem } from '@/components/product'
import { useWindowSize } from '@/hooks'
import { routes } from '@/constants'
import router from 'next/router'
import cx from 'classnames'
import $api from '@/components/Http/axios'
import { useQuery } from '@tanstack/react-query'
import { SwiperSlider } from '@/components/UI/carousel/SwiperSlider'
import { TSwiperType } from '@/components/UI/carousel/SliderPagination/types'
import { SLIDER_CATEGORIES_BREAKPOINTS, SLIDER_PRODUCTS_BREAKPOINTS } from './constants'
import OffersSliderSkeleton from './OffersSliderSkeleton'
import CategoriesOffer from '../CategoriesOffer'
import SwiperController from './SwiperController'
import s from './styles.module.scss'

interface IOffersSliderProps {
  id: string
}

type SliderItemType = {
  title: string
  products: IProduct[]
  type: 'categories' | 'products'
  categoryList: TOfferCategoriesList[]
}

const OffersSlider = ({ id }: IOffersSliderProps) => {
  const [swiper, setSwiper] = useState<TSwiperType | null>(null)
  const [visibleSlidesIndexes, setVisibleSlidesIndexes] = useState([0])
  const { isLarge } = useWindowSize()

  const { data, isLoading } = useQuery<SliderItemType>({
    queryFn: async () => {
      const { data: response, status } = await $api.get(`/api/offers/${id}`)
      if (status === 200) return response?.data
    },
    queryKey: ['GET_OFFER', id]
  })

  const isTypeProducts = data?.type === 'products'
  const isTypeCategories = data?.type === 'categories'
  const notItems = !isLoading && !data?.products?.length
  const hasNextSliderButton = (isTypeProducts && (swiper?.slides.length ?? 0) > 5) || isTypeCategories

  const swiperEventHandler = (e: TSwiperType) => setVisibleSlidesIndexes(e.visibleSlidesIndexes ?? [])

  useEffect(() => {
    swiper?.on('transitionEnd', swiperEventHandler)
    return () => swiper?.off('transitionEnd', swiperEventHandler)
  }, [swiper])

  if (isTypeProducts && notItems) return null

  return (
    <section className={cx(s['offers-slider'], { [s['not-items']]: data?.type !== 'categories' && notItems })}>
      {isTypeCategories && (
        <header className={s['offers-slider__header']}>
          <Text as='h2'>{data.title}</Text>
        </header>
      )}
      {isTypeProducts && Boolean(data.products.length) && (
        <header className={s['offers-slider__header']}>
          <Text as='h2'>{data?.title || '...'}</Text>
          {data.products.length > 20 && (
            <Button
              className={s['offers-slider__button']}
              view='link'
              onClick={() => router.push(`${routes.OFFER}/${id}`)}
            >
              Cмотреть все
            </Button>
          )}
        </header>
      )}
      {isLoading ? (
        <OffersSliderSkeleton />
      ) : (
        <>
          <SwiperSlider
            breakpoints={isTypeCategories ? SLIDER_CATEGORIES_BREAKPOINTS : SLIDER_PRODUCTS_BREAKPOINTS}
            slidesPerView={isTypeCategories ? 'auto' : undefined}
            showPagination={isTypeProducts}
            prevArrow={isLarge && visibleSlidesIndexes[0] !== 0}
            nextArrow={hasNextSliderButton && isLarge && (swiper?.progress ?? 0) <= 0.9}
            prevArrowClassName={cx({ [s['category-arrow']]: isTypeCategories })}
            nextArrowClassName={cx({ [s['category-arrow']]: isTypeCategories })}
            arrowView='product'
            watchSlidesProgress
          >
            <SwiperController setState={setSwiper} />
            {isTypeProducts &&
              Boolean(data?.products?.length) &&
              data?.products.map((item: IProduct) => (
                <SwiperSlider.SwiperSlide key={item._id}>
                  <ProductItem product={item} />
                </SwiperSlider.SwiperSlide>
              ))}
            {isTypeCategories &&
              data.categoryList.map((item) => (
                <SwiperSlider.SwiperSlide style={{ width: 'auto' }} key={item.category._id}>
                  <CategoriesOffer {...item} />
                </SwiperSlider.SwiperSlide>
              ))}
          </SwiperSlider>
        </>
      )}
    </section>
  )
}

export default OffersSlider
