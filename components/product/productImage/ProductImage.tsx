import React, { memo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import cx from 'classnames'
import { DEFAULT_PRODUCT_PATH, routes } from '@/constants'
import { IProduct } from '@/models'
import { AddToFavoritesButton } from '@/components/favorite'
import styles from './product-image.module.scss'

interface IProductImageProps {
  id?: string
  link: string | undefined
  className?: string
  addToFavorite?: boolean
  asLink?: boolean
  product?: IProduct
  onClick?: VoidFunction
  fit?: 'cover' | 'contain'
  initBackground?: boolean
  disabled?: boolean
  removeFavoritesInterceptor?: (arg0: IProduct) => Promise<string>
}

export const ProductImage = memo(
  ({
    id,
    link,
    className,
    addToFavorite = true,
    asLink = true,
    product,
    onClick,
    fit = 'contain',
    initBackground = false,
    removeFavoritesInterceptor,
    disabled = false
  }: IProductImageProps) => {
    const [imageSrc, setImageSrc] = useState<string>(link ?? DEFAULT_PRODUCT_PATH)

    const classNameList = cx(
      styles['product-image'],
      {
        [styles['init-background']]: initBackground,
        [styles['cursor-pointer']]: onClick,
        [styles.disabled]: disabled
      },
      className
    )

    const ImageComponent = () => (
      <Image
        src={imageSrc}
        sizes='500px'
        style={{ objectFit: fit }}
        onError={() => setImageSrc(DEFAULT_PRODUCT_PATH)}
        alt={product?.productName ?? ''}
        placeholder='blur'
        blurDataURL='/dots-loader.svg'
        data-image-path={link}
        quality={90}
        fill
        priority
      />
    )

    return (
      <div className={classNameList} onClick={onClick}>
        {asLink && id ? (
          <Link href={`${routes.PRODUCT}/${id}`} className={styles['product-image__image']}>
            <ImageComponent />
          </Link>
        ) : (
          <div className={styles['product-image__image']}>
            <ImageComponent />
          </div>
        )}
        {addToFavorite && product && (
          <div onClick={(e) => e.stopPropagation()} className={styles['product-image__add-to-favorite']}>
            <AddToFavoritesButton
              removeFavoritesInterceptor={removeFavoritesInterceptor}
              as='image'
              item={product}
              clickOutsideArea={8}
              size={20}
            />
          </div>
        )}
      </div>
    )
  }
)
