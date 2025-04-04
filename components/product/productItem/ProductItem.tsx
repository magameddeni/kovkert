import React from 'react'
import Link from 'next/link'
import { routes } from '@/constants'
import { IProduct } from '@/models'
import { Icon, Text } from '@/components/UI'
import { ProductItemSkeleton, ProductName, ProductPrice, ProductImage } from '@/components/product'
import AddToBasketButton from '@/components/basket/AddToBasketButton'

import s from './product-item.module.scss'

interface IProductItemProps {
  product: IProduct | undefined
  isLoading?: boolean
  removeFavoritesInterceptor?: (arg0: IProduct) => Promise<string>
}

export const ProductItem = ({ product, isLoading, removeFavoritesInterceptor }: IProductItemProps) => {
  if (isLoading) return <ProductItemSkeleton />
  if (!product) return null

  return (
    <div className={s['product-item']}>
      <ProductImage
        id={product._id}
        product={product}
        link={product?.images?.[0]?.link}
        className={s['product-item__image']}
        removeFavoritesInterceptor={removeFavoritesInterceptor}
      />
      <Link href={`${routes.PRODUCT}/${product._id}`}>
        <div className={s['product-item__info']}>
          <ProductPrice discountPrice={product.discountPrice} regularPrice={product?.regularPrice} />
          <Text as='p' size='xs' className={s['shop-name']} family='secondary'>
            {product?.shop?.name}
          </Text>
          <ProductName name={product.productName} />
          <div className={s.rating}>
            <Icon name='star' color={product?.rating ? 'orange' : 'gray'} />
            <Text className={s.rating__text} weight='regular' color={product?.rating ? 'primary' : 'gray'}>
              {product.rating ? product?.rating?.toFixed(1) : 'Нет оценок'}
            </Text>
          </div>
        </div>
      </Link>
      <div className='offset-top-12'>
        <AddToBasketButton product={product} />
      </div>
    </div>
  )
}
