import React from 'react'
import useMediaQuery from '@/components/Hooks/useMediaQuery'
import { ProductItemSkeleton } from '@/components/product'
import s from './styles.module.scss'

const skeletonsData = [1, 2, 3, 4, 5]

const OffersSliderSkeleton = () => {
  const isTablet = useMediaQuery('(max-width:991px)')
  const isMobile = useMediaQuery('(max-width:767px)')

  const renderSkeletons = () =>
    skeletonsData.slice(0, isMobile ? 2 : isTablet ? 4 : 5).map((item) => <ProductItemSkeleton key={item} />)

  return <div className={s['offers-slider-skeleton']}>{renderSkeletons()}</div>
}

export default OffersSliderSkeleton
