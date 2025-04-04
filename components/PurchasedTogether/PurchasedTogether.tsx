import React from 'react'
import $api from '@/components/Http/axios'
import { IProduct } from '@/models'
import { useQuery } from '@tanstack/react-query'
import { Row, Text, Col } from '@/components/UI'
import { ProductItem } from '@/components/product'
import { SwiperSlider, Pagination, Thumbs } from '@/components/UI/carousel/SwiperSlider'
import useMediaQuery from '@/components/Hooks/useMediaQuery'
import s from './purchased_together.module.scss'

interface IPurchasedTogetherProps {
  productId: string
  styles?: React.CSSProperties
}

const PurchasedTogether: React.FC<IPurchasedTogetherProps> = ({ productId, styles }) => {
  const { data, isError, isLoading } = useQuery<IProduct[]>({
    queryFn: async () => {
      const { data: result, status } = await $api.get(`/api/products/purchased/together/${productId}`)
      if (status !== 200) return new Error('Ошибка')
      return result
    },
    queryKey: [productId]
  })

  const isMobile = useMediaQuery('(max-width:576px)')
  const mediumDevice = useMediaQuery('(max-width:992px)')

  if (!data?.length || isError || isLoading) return null

  return (
    <Row style={styles} className={s.together}>
      <Text as='h2' className={s.together__title}>
        С этим товаром покупают
      </Text>
      <Col>
        <SwiperSlider
          spaceBetween={20}
          watchSlidesProgress
          modules={[Pagination, Thumbs]}
          slidesPerView={isMobile ? 2 : mediumDevice ? 3 : 5}
        >
          {data.map((card) => (
            <SwiperSlider.SwiperSlide key={card._id}>
              <ProductItem product={card} />
            </SwiperSlider.SwiperSlide>
          ))}
        </SwiperSlider>
      </Col>
    </Row>
  )
}

export default PurchasedTogether
