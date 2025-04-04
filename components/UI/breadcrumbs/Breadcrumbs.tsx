import React from 'react'
import { routes } from '@/constants'
import { Pagination, SwiperSlider } from '@/components/UI/carousel/SwiperSlider'
import { Crumb } from './Crumb'

export interface CrumbElement {
  name: string
  _id: string
}

export interface BreadcrumbsProps {
  crumbs: CrumbElement[]
  className?: string
  classNameWrapper?: string
  withIndexPageCrumb?: boolean
}

export const Breadcrumbs = ({ crumbs, className, classNameWrapper, withIndexPageCrumb = true }: BreadcrumbsProps) => {
  const indexPageCrumb = { _id: routes.MAIN, name: 'Главная' }

  const currentCrumbs: CrumbElement[] = withIndexPageCrumb ? [indexPageCrumb, ...crumbs] : crumbs

  return (
    <div style={{ marginRight: '-16px' }} className={classNameWrapper}>
      <SwiperSlider
        slidesPerView='auto'
        spaceBetween={12}
        pagination={{
          clickable: true
        }}
        modules={[Pagination]}
        className={className}
      >
        {currentCrumbs.map((crumb: CrumbElement, index: number, arr: CrumbElement[]) => (
          <SwiperSlider.SwiperSlide key={crumb._id} style={{ width: 'auto' }}>
            <Crumb key={crumb._id} rightArrow={index !== arr.length - 1} href={crumb._id} text={crumb.name} />
          </SwiperSlider.SwiperSlide>
        ))}
      </SwiperSlider>
    </div>
  )
}
