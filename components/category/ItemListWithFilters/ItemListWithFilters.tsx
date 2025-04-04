import React, { PropsWithChildren, ReactNode, useRef, useState } from 'react'
import cx from 'classnames'
import { IFilter, IProduct, TCategory } from '@/models'
import { productDeclension, scrollToTop } from '@/helpers'
import { useWindowSize, useQueryParams } from '@/hooks'
import { Breadcrumbs, Col, Container, EmptyPage, Modal, Pagination, Row, Text, BreadcrumbsProps } from '@/components/UI'
import {
  ProductItem,
  ProductItemHorizontal,
  ProductItemHorizontalSkeleton,
  ProductItemSkeleton
} from '@/components/product'
import { Filters, FiltersMobile } from '@/components/category'
import CategoryNav from '@/components/category/CategoryNav'
import CategoryItem from '@/components/category/CategoryItem'
import CategoryNavBlockSkeleton from '@/components/category/CategoryNavBlockSkeleton'
import WatchedProducts from '@/components/WatchedProducts/WatchedProducts'
import { LIMIT_ITEMS_ON_PAGE } from '@/components/category/const'
import { CategoryContentHeaderModule } from '@/components/category/modules'
import s from './styles.module.scss'

interface TItemListWithFilters extends PropsWithChildren {
  title?: string
  products: IProduct[]
  productTotalCount: number
  isLoading: boolean
  category?: any
  nesting: number
  filtersList: IFilter[]
  breadcrumbs?: BreadcrumbsProps
  withCategoryFilterModule?: boolean
  withWatchedProductsModule?: boolean
  subTitle?: string | ReactNode
}

const ItemListWithFilters = ({
  children,
  title,
  products,
  productTotalCount,
  isLoading,
  category,
  nesting,
  filtersList,
  breadcrumbs,
  withCategoryFilterModule,
  withWatchedProductsModule,
  subTitle = 'Товары'
}: TItemListWithFilters) => {
  const [isShowMobileFilters, setIsShowMobileFilters] = useState<boolean>(false)
  const { size, isLarge, isSmall } = useWindowSize()
  const {
    fullQuery: { view, joinProducts, page },
    setQuery,
    deleteQuery
  } = useQueryParams()
  const productsRef = useRef<HTMLDivElement | null>(null)

  const isJoinProductsOnPagination = joinProducts === 'true'

  const closeMobileFilterModal = () => setIsShowMobileFilters(false)

  const onPaginationChange = async (value: number) => {
    scrollToTop(
      !isLarge && productsRef?.current ? window.scrollY + productsRef?.current?.getBoundingClientRect().top - 50 : 0
    )
    if (isJoinProductsOnPagination) await deleteQuery('joinProducts')
    await setQuery({ page: String(value) })
  }

  const onPaginationShowMoreChange = async (value: number) => {
    await setQuery({ page: String(value), joinProducts: 'true' })
  }

  const renderSkeletons = (skeletonView: 'horizontal' | 'grid' = 'grid') => {
    const skeletonsData = [1, 2, 3, 4, 5, 6, 7, 8]

    return skeletonsData.slice(0, isSmall ? 4 : size === 'sm' || size === 'lg' ? 6 : 8).map((item) =>
      skeletonView === 'grid' ? (
        <Col key={item} xs={6} sm={4} md={3} lg={4} xl={3} className={s['product-item-wrapper']}>
          <ProductItemSkeleton />
        </Col>
      ) : (
        <div key={item} className={s['product-item-horizontal-wrapper']}>
          <ProductItemHorizontalSkeleton />
        </div>
      )
    )
  }

  const renderHasNoProducts = () => <EmptyPage description='В данной категории сейчас нет товаров' />

  return (
    <>
      <Container className={s['item-list']}>
        {children}
        {breadcrumbs?.crumbs && <Breadcrumbs {...breadcrumbs} />}
        {title && (
          <div className={s['item-list__title']}>
            <Text as='h1'>{title}</Text>
            {Boolean(nesting) && (
              <Text
                as='p'
                size='sm'
                family='secondary'
                className={s['products-found']}
                color={isLarge ? 'primary' : 'gray'}
              >
                {productTotalCount}
                <Text size='sm' color='gray' family='secondary'>
                  {productDeclension(productTotalCount)}
                </Text>
              </Text>
            )}
          </div>
        )}
        <Row className={s['main-row']}>
          {Boolean(
            (products?.length || (!products?.length && filtersList?.length) || isLoading) && (isLarge || nesting)
          ) && (
            <Col className={s['item-list__nav']}>
              {withCategoryFilterModule && (
                <>
                  {category?.children}
                  {isLoading ? <CategoryNavBlockSkeleton /> : <CategoryNav {...category} />}
                </>
              )}
              {!!nesting && isLarge && <Filters filters={filtersList} />}
            </Col>
          )}
          <Col className={cx(s['item-list__content'], { [s.nesting]: nesting })}>
            {!nesting && (
              <>
                {withCategoryFilterModule && Boolean(category?.category?.sub) && (
                  <Row row={!isLarge ? 16 : 20} small={!isLarge}>
                    {category?.category.sub.map((v: TCategory) => (
                      <Col key={v._id} xs={4} sm={3} className={s['category-item-wrapper']}>
                        <CategoryItem category={v} />
                      </Col>
                    ))}
                  </Row>
                )}
                <Text as='h2' className={cx({ 'offset-top-48': category?.category?.sub })}>
                  {subTitle}
                </Text>
              </>
            )}
            {Boolean(nesting) && (
              <CategoryContentHeaderModule
                onMobileFilterClick={() => setIsShowMobileFilters(true)}
                filtersList={filtersList}
              />
            )}
            <div ref={productsRef} className='offset-top-16'>
              {view !== 'list' ? (
                <Row row={isSmall ? 16 : 20} small={!isLarge}>
                  {isLoading && !isJoinProductsOnPagination
                    ? renderSkeletons()
                    : products?.length
                      ? products.map((product: IProduct) => (
                          <Col
                            key={Math.random()}
                            xs={6}
                            sm={4}
                            md={3}
                            lg={4}
                            xl={3}
                            className={s['product-item-wrapper']}
                          >
                            <ProductItem product={product} />
                          </Col>
                        ))
                      : renderHasNoProducts()}
                  {isLoading && isJoinProductsOnPagination && renderSkeletons()}
                </Row>
              ) : (
                <>
                  {isLoading && !isJoinProductsOnPagination
                    ? renderSkeletons('horizontal')
                    : products?.length
                      ? products.map((product: IProduct) => (
                          <div key={Math.random()} className={s['product-item-horizontal-wrapper']}>
                            <ProductItemHorizontal product={product} />
                          </div>
                        ))
                      : renderHasNoProducts()}
                  {isLoading && isJoinProductsOnPagination && renderSkeletons('horizontal')}
                </>
              )}
            </div>
            <Pagination
              classNameWrapper='offset-top-24'
              totalCount={productTotalCount}
              pageIndex={+String(page) || 1}
              onPage={LIMIT_ITEMS_ON_PAGE}
              onChange={onPaginationChange}
              onChangeShowMore={onPaginationShowMoreChange}
            />
          </Col>
        </Row>
        {withWatchedProductsModule && (
          <div className='offset-top-64'>
            <WatchedProducts />
          </div>
        )}
      </Container>

      <Modal
        isOpen={!isLarge && isShowMobileFilters}
        onRequestClose={closeMobileFilterModal}
        closePlace='left'
        size='full'
        fixCloseIcon
      >
        <FiltersMobile
          filters={filtersList}
          productsCount={products.length}
          onCompleteSelected={closeMobileFilterModal}
        />
      </Modal>
    </>
  )
}

export default ItemListWithFilters
