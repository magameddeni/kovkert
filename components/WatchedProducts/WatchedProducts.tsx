import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ProductCardSlider, ProductItem } from '@/components/product'
import { useAppSelector } from '@/redux/hook'
import { Row, Text, Col } from '@/components/UI'
import { IProduct } from '@/models'
import $api from '@/components/Http/axios'
import useMediaQuery from '../Hooks/useMediaQuery'
import s from './watched_products.module.scss'

interface IWatchedProductsProps {
  grid?: boolean
  gridStyles?: React.CSSProperties
}

const WatchedProducts: React.FC<IWatchedProductsProps> = ({ grid = false, gridStyles }) => {
  const watchedProductsId = useAppSelector((state) => state.beru.products.watchedProducts)

  const {
    data: watchedProducts,
    isError,
    isLoading
  } = useQuery<IProduct[]>({
    queryFn: async () => {
      const { data, status } = await $api.get(`/api/products/watched/${JSON.stringify(watchedProductsId)}`)
      if (status !== 200) return new Error('Ошибка')
      return data
    },
    queryKey: watchedProductsId
  })

  const isMobile = useMediaQuery('(max-width:576px)')
  const mediumDevice = useMediaQuery('(max-width:992px)')

  if (!watchedProducts?.length || isError || isLoading) return null

  return (
    <Row className={s.watched}>
      <Text as='h2' className={s.watched__title}>
        Вы смотрели
      </Text>
      <Col>
        {grid ? (
          <div style={gridStyles} className={s.watched__grid}>
            {watchedProducts.map((product) => (
              <ProductItem product={product} />
            ))}
          </div>
        ) : (
          <ProductCardSlider slidesPerView={isMobile ? 2 : mediumDevice ? 3 : 5} slides={watchedProducts} />
        )}
      </Col>
    </Row>
  )
}

export default WatchedProducts
