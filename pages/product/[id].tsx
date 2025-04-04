import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import cx from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { useAppDispatch } from '@/redux/hook'
import { addProductWatched } from '@/redux/product/productsSlice'
import { useWindowSize, useProductPrice } from '@/hooks'
import { meta, routes } from '@/constants'
import { Breadcrumbs, Button, Container, Icon, Text, GalleryViewer, CrumbElement } from '@/components/UI'
import { FreeMode, Navigation, Pagination, SwiperSlider, Thumbs } from '@/components/UI/carousel/SwiperSlider'
import { IProduct, TAffiliateProperties, TCategory } from '@/models'
import { PageHeader, ProductHeader } from '@/components/ProductPage'
import { ProductImage, ProductReviews, ProductCardSlider, ProductPrice } from '@/components/product'
import ProductCharacteristics from '@/components/ProductPage/ProductCharacteristics'
import PurchasedTogether from '@/components/PurchasedTogether/PurchasedTogether'
import AddToBasketButton from '@/components/basket/AddToBasketButton'
import SliderImages from '@/components/SliderImages/SliderImages'
import Error404 from '@/components/404Page/404'
import Layout from '@/components/layout/Main'
import $api from '@/components/Http/axios'
import s from './product_page.module.scss'

interface ProductPageInterface {
  data: IProduct
  similarProducts: IProduct[]
  id: string
  breadcrumbs: CrumbElement[]
  affiliateProperties: TAffiliateProperties
}

export const getServerSideProps = async (context: any) => {
  const { code, discount, id } = context.query
  let productQueryString = ''
  if (code && discount && id) {
    productQueryString = new URLSearchParams(context.query).toString()
  } else {
    productQueryString = `id=${context?.params?.id}`
  }
  const { data: card } = await $api.get(`/api/card/getcard?${productQueryString}`)
  const similarProducts = await $api.get(`/api/products/${context?.params?.id}/similar`)

  let breadcrumbs = [{ _id: routes.CATEGORY, name: 'Каталог' }]

  if (card.message.card) {
    breadcrumbs = [
      ...breadcrumbs,
      ...card.message.card.categories.map((v: TCategory) => ({ _id: `${routes.CATEGORY}/${v._id}`, name: v.name }))
    ]
  }

  return {
    props: {
      id: context.params.id,
      data: card.message.card || null,
      similarProducts: similarProducts?.data || [],
      breadcrumbs,
      affiliateProperties:
        code && discount
          ? {
              affiliateCode: code,
              affiliateDiscount: Number(discount)
            }
          : {}
    }
  }
}

const ProductPage: React.FC<ProductPageInterface> = ({
  data,
  similarProducts,
  id,
  breadcrumbs,
  affiliateProperties
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  const [showGallery, setShowGallery] = useState(false)
  const { isLarge, isSmall, size } = useWindowSize()
  const descriptionRef = useRef<HTMLElement | null>(null)
  const characteristicsRef = useRef<HTMLElement | null>(null)
  const reviewsRef = useRef<HTMLElement | null>(null)
  const dispatch = useAppDispatch()

  const price = useProductPrice(data.discountPrice, data?.regularPrice, affiliateProperties?.affiliateDiscount)

  const brandName = useMemo(
    () => data?.characteristics.find((c) => c.title === 'Бренд')?.value?.[0],
    [data?.characteristics]
  )

  const categoryInfo = useMemo(
    () => data.categories[data.categories.length - 1] as unknown as TCategory,
    [data.categories]
  )

  const { data: ratingData, isLoading } = useQuery({
    queryFn: async () => {
      const { data: resultRating, status } = await $api.get(`/api/reviews/${id}/ratings`)
      if (status === 200) return resultRating
      return new Error('Ошибка получения рейтинга на товар')
    },
    queryKey: ['GET_RATING', id],
    retry: 1,
    refetchOnWindowFocus: false
  })

  const scrollToElement = (refElement: any) => {
    if (!refElement?.current) return
    refElement.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const openGallery = () => setShowGallery(true)

  const getSliderPerViewForItCanUsefulBlock = () => {
    if (isSmall) return 2
    if (size === 'sm') return 3
    if (size === 'md' || size === 'lg') return 4
    return 5
  }

  const renderProductHeader = () => (
    <div className={s['product-header']}>
      <ProductHeader
        product={data}
        rating={ratingData?.average?.toFixed(1)}
        numberReviews={ratingData?.totalCount}
        onReviews={() => scrollToElement(reviewsRef)}
      />
    </div>
  )

  const renderBrandLinks = () => (
    <>
      {brandName && (
        <div className={cx('offset-top-24', s['brand-links'])}>
          <Link href={`${routes.BRAND}/${brandName}`} className={s['brand-links__link']}>
            <Text family='secondary'>{brandName}</Text>
            <Icon name='arrow-right' size='xs' color='gray' />
          </Link>
          <Link href={`${routes.CATEGORY}/${categoryInfo?._id}?brand=${brandName}`} className={s['brand-links__link']}>
            <Text>
              Все {categoryInfo?.name?.toLowerCase()}
              <Text family='secondary'> {brandName}</Text>
            </Text>
            <Icon name='arrow-right' size='xs' color='gray' />
          </Link>
        </div>
      )}
    </>
  )

  useEffect(() => {
    dispatch(addProductWatched(id))
  }, [data])

  if (!data) {
    return (
      <Layout meta={{ ...meta.ERROR_PAGE('Товар не найден') }}>
        <Error404 />
      </Layout>
    )
  }

  return (
    <Layout meta={{ ...meta.PRODUCT(data.productName ?? '', data?.seo ?? '', data) }}>
      <PageHeader
        product={data}
        rating={ratingData?.average?.toFixed(1)}
        totalCount={ratingData?.totalCount}
        affiliateProperties={affiliateProperties}
      />
      <Container className={s['product-page']}>
        <Breadcrumbs crumbs={breadcrumbs} />
        <div className={s.product_name}>
          <Text as='h1'>{data.productName}</Text>
        </div>
        {isLarge && renderProductHeader()}
        <article className={s.content}>
          <div className={s.content__image_block}>
            {isLarge && (
              <div className={s.content__slider}>
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
                {data.images.length > 4 && (
                  <div className={s.content__image_more} onClick={openGallery}>
                    <Text color='blue' align='center' size='xxs' weight='regular'>
                      Еще {data.images.length - 3}
                    </Text>
                  </div>
                )}
              </div>
            )}
            {!isLarge ? (
              <SliderImages addFavorite key={data._id} handlerImageClick={openGallery} product={data} />
            ) : (
              <SwiperSlider
                pagination
                initialSlide={0}
                mousewheel={false}
                allowTouchMove={false}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                thumbs={{
                  swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
                }}
              >
                {data.images.map((items) => (
                  <SwiperSlider.SwiperSlide key={items._id}>
                    <ProductImage link={items.link} asLink={false} className={s.content__image} onClick={openGallery} />
                  </SwiperSlider.SwiperSlide>
                ))}
              </SwiperSlider>
            )}
          </div>
          {isLarge && (
            <div className={s.content__info}>
              <section className={s.content__description_section}>
                <Text className={s.content__description_text}>{data.description}</Text>
                {data.description.length > 250 && (
                  <div className={s['content__description_more-btn']}>
                    <Button view='link' onClick={() => scrollToElement(descriptionRef)}>
                      Читать далее
                    </Button>
                  </div>
                )}
              </section>
              <ProductCharacteristics
                onScrollTo={() => scrollToElement(characteristicsRef)}
                count={10}
                data={data.characteristics}
              />
              {renderBrandLinks()}
            </div>
          )}
          {!isLarge && renderProductHeader()}
          <article className={s.content__shop_pay}>
            <div className={s.content__pay_block}>
              <ProductPrice
                discountPrice={price.current}
                regularPrice={price.prev}
                discountPriceSize='xxxl'
                regularPriceSize='sm'
              />
              <div className={s.content__pay_btn}>
                <AddToBasketButton product={data} affiliateProperties={affiliateProperties} fluid withAuth />
              </div>
              <div className={s.content__shipping_data}>
                <div className={s['content__self_delivery-title']}>
                  Самовывоз:
                  <span className={s['content__self_delivery-value']}>Бесплатно</span>
                </div>
              </div>
            </div>
            <Link href={`${routes.SHOP}/${data?.shop?.slug}`} className={s.shop}>
              <div className={s.shop__avatar}>
                <ProductImage link={data.shop.image} />
              </div>
              <div className={s.shop__name}>{data?.shop?.name}</div>
            </Link>
          </article>
        </article>
        <PurchasedTogether styles={{ margin: isSmall ? '32px 0' : '72px 0' }} productId={id} />
        <section className={s.description_section} ref={descriptionRef}>
          <Text className={s.description_title} as='h2'>
            Описание
          </Text>
          <Text className={s.description_section__text}>{data.description}</Text>
        </section>
        <section className={s.characteristics_section} ref={characteristicsRef}>
          <Text as='h2'>Характеристики</Text>
          <ProductCharacteristics
            onScrollTo={() => scrollToElement(characteristicsRef)}
            count={data.characteristics.length}
            data={data.characteristics}
          />
          {!isLarge && renderBrandLinks()}
        </section>
        <section className={s.offers_list}>
          {Array.isArray(similarProducts) && !!similarProducts.length && (
            <>
              <Text className={s.offer_list_title} as='h2'>
                Может пригодиться
              </Text>
              <ProductCardSlider slidesPerView={getSliderPerViewForItCanUsefulBlock()} slides={similarProducts} />
            </>
          )}
        </section>
        <section ref={reviewsRef}>
          <ProductReviews productId={id} ratingData={ratingData} isLoadingRating={isLoading} />
        </section>
      </Container>
      {showGallery && <GalleryViewer card={data} currentSlideIndex={0} onCloseGallery={() => setShowGallery(false)} />}
    </Layout>
  )
}

export default ProductPage
