import React, { useEffect, useMemo, useRef } from 'react'
import cx from 'classnames'
import { IBasketItem, IProduct, TAffiliateProperties } from '@/models'
import { useWindowSize, useProductPrice } from '@/hooks'
import { useAppSelector } from '@/redux/hook'
import { setSpaceBetweenCharacters } from '@/helpers'
import { Container, Icon, Text } from '@/components/UI'
import { ProductImage } from '@/components/product'
import AddToBasketButton from '@/components/basket/AddToBasketButton'
import s from './page_header.module.scss'

interface HeaderProps {
  product: IProduct
  rating: string | undefined
  totalCount: string | undefined
  affiliateProperties?: TAffiliateProperties
}

const HEADER_SHOW = s['header--no_active']

const PageHeader: React.FC<HeaderProps> = ({ product, rating, totalCount, affiliateProperties }) => {
  const { isLarge, isSmall } = useWindowSize()
  const headerRef = useRef<HTMLDivElement | null>(null)

  const basket = useAppSelector(({ beru }) => beru.basket)
  const currentProduct: IBasketItem | undefined = basket?.data?.find(
    (basketItem: IBasketItem) => basketItem?.product?._id === product._id
  )

  const price = useProductPrice(product.discountPrice, product?.regularPrice, affiliateProperties?.affiliateDiscount)

  const addToBasketButtonSize = useMemo(
    () => (currentProduct ? (isSmall ? '160px' : '224px') : isLarge ? '140px' : '103px'),
    [currentProduct, isSmall, isLarge]
  )

  useEffect(() => {
    const onScroll = () => headerRef?.current?.classList.toggle(HEADER_SHOW, window.scrollY < 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const renderPrice = () => (
    <Text size='xxl' family='secondary' weight='medium' className={s.header__price} whiteSpace='nowrap'>
      {setSpaceBetweenCharacters(price.current)} ₽
    </Text>
  )

  if (!product) return null

  return (
    <div className={cx(s.header, s['header--no_active'])} ref={headerRef}>
      <Container className={s.header__container}>
        <div className={s.header__card_info}>
          {!isSmall && <ProductImage link={product.images?.[0]?.link} asLink={false} className={s.header__image} />}
          <div>
            <div className={s.header__card_name}>{product.productName}</div>
            {isSmall && renderPrice()}
            {!isSmall && (
              <div className={s.header__review}>
                <span className={s.header__rating}>
                  <Icon size='md' name='star' color={rating ? 'orange' : 'gray'} />
                  {rating || 'Нет оценок'}
                </span>
                {totalCount && <span className={s.header__number_reviews}>{totalCount} отзыва</span>}
              </div>
            )}
          </div>
        </div>
        <div className={s.header__pay_price}>
          {!isSmall && renderPrice()}
          <div style={{ width: addToBasketButtonSize }}>
            <AddToBasketButton
              product={product}
              textSize={isSmall ? 'xs' : undefined}
              affiliateProperties={affiliateProperties}
              fluid
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

export default PageHeader
