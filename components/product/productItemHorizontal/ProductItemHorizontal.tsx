import React from 'react'
import Link from 'next/link'
import { routes } from '@/constants'
import { IProduct, IProductCharacteristics } from '@/models'
import { Icon, Text } from '@/components/UI'
import { ProductPrice, ProductImage } from '@/components/product'
import { AddToFavoritesButton } from '@/components/favorite'
import AddToBasketButton from '@/components/basket/AddToBasketButton'
import s from './product-item-horizontal.module.scss'

interface IProductItemHorizontalProps {
  product: IProduct | undefined
}

export const ProductItemHorizontal = ({ product }: IProductItemHorizontalProps) => {
  if (!product) return null

  const requiredCharacteristics = {
    'Тип товара': true,
    Бренд: true,
    'Страна-производитель': true,
    Артикул: true
  } as { [key: string]: boolean }

  return (
    <div className={s['product-item-horizontal']}>
      <ProductImage
        id={product._id}
        link={product.images[0]?.link}
        addToFavorite={false}
        className={s['product-item-horizontal__image']}
        product={product}
      />
      <div className={s['product-item-horizontal__info']}>
        <Link href={`${routes.PRODUCT}/${product._id}`}>
          <Text size='md' className={s.title} family='secondary'>
            {product.productName}
          </Text>
        </Link>
        {'characteristics' in product && (
          <div className={s.characteristics}>
            {product.characteristics
              .filter((v: IProductCharacteristics) => requiredCharacteristics[v.title])
              .reverse()
              .map((v: IProductCharacteristics) => (
                <div key={v._id} className={s.characteristics__item}>
                  <Text as='p' size='xxs' color='gray'>
                    {v.title}:{v?.value && <Text size='xxs'>{v.value?.[0]}</Text>}
                  </Text>
                </div>
              ))}
          </div>
        )}
        <div className={s.rating}>
          <Icon name='star' color={product?.rating ? 'orange' : 'gray'} />
          <Text className={s.rating__text} weight='regular' color={product?.rating ? 'primary' : 'gray'}>
            {product?.rating || 'Нет оценок'}
          </Text>
        </div>
      </div>
      <div className={s['product-item-horizontal__price']}>
        <ProductPrice
          discountPrice={product.discountPrice}
          regularPrice={product.regularPrice}
          discountPriceSize='xxl'
        />
        <div className={s['basket-buttons-and-favorite']}>
          <AddToBasketButton product={product} fluid />
          <div className={s['add-to-favorite']}>
            <AddToFavoritesButton item={product} size='xxl' />
          </div>
        </div>
        <div className={s.delivery}>
          <Text as='p' size='xxs' color='gray'>
            Самовывоз:
            <Text size='xxs'>Бесплатно</Text>
          </Text>
          {/* <Text as='p' size='xxs' color='gray'> */}
          {/*  Доставка: */}
          {/*   <Text size='xxs'>Бесплатно</Text> */}
          {/* </Text> */}
        </div>
        {product.shop?.slug && (
          <Link href={`${routes.SHOP}/${product.shop.slug}`} className={s.store}>
            <Icon name='store-stretch' size='sm' color='gray' />
            <Text size='xxs' color='gray' className={s.store__name}>
              {product.shop?.name ?? ''}
            </Text>
          </Link>
        )}
      </div>
    </div>
  )
}
