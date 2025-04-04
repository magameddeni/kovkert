import React, { useState } from 'react'
import cx from 'classnames'
import { useMutation } from '@tanstack/react-query'
import emitter, { EVENTS } from '@/utils/emitter'
import { useAppSelector } from '@/redux/hook'
import { useMessage, useWindowSize } from '@/hooks'
import { IProduct, ProductAffiliate } from '@/models'
import { HexagonalButton, Text } from '@/components/UI'
import { PreviewCard, ProductImage, ProductName, ProductPrice } from '@/components/product'
import {
  ConnectAffiliateProgramModal,
  AffiliateDiscountPercentage,
  SuccessJoinProductModal
} from '@/components/affiliate'
import $api from '@/components/Http/axios'
import s from '../../product/productItem/product-item.module.scss'

interface ProductItemAffiliateProps {
  product: ProductAffiliate | undefined
  connected?: boolean
  onSuccessConnected?: VoidFunction
}

export const ProductItemAffiliate = ({ product, connected = false, onSuccessConnected }: ProductItemAffiliateProps) => {
  const [previewCard, setPreviewCard] = useState<IProduct | undefined>(undefined)
  const [connectProduct, setConnectProduct] = useState<ProductAffiliate | undefined>(undefined)
  const [shortLinkCode, setShortLinkCode] = useState<string | undefined>(undefined)
  const { isSmall } = useWindowSize()

  const { isLoggedIn } = useAppSelector(({ beru }) => beru.user)

  const { mutate: getProductCard, isPending } = useMutation({
    mutationFn: async () => {
      const {
        data: { message },
        status
      } = await $api.get(`/api/card/getcard?id=${product?.productId}`)
      if (status === 200) return message
    },
    onSuccess: (data) => {
      setPreviewCard(data.card)
    },
    onError: () => {
      useMessage('Нельзя открыть предпросмотр товара', 'error')
    }
  })

  const productInfoClassList = cx(s['product-item__info'], s['cursor-pointer'], {
    [s.disabled]: isPending
  })

  const handleSuccessJoin = (link: string) => {
    setConnectProduct(undefined)
    setShortLinkCode(link)
  }

  const productJoinHandler = () => {
    if (!isLoggedIn) {
      return emitter.emit(EVENTS.SHOW_LOGIN_MODAL)
    }

    setConnectProduct(product)
  }

  const clearPreviewCard = () => setPreviewCard(undefined)
  const clearConnectProduct = () => setConnectProduct(undefined)
  const handleCloseSuccessModal = () => {
    setShortLinkCode(undefined)
    onSuccessConnected?.()
  }

  if (!product) return null

  return (
    <div className={s['product-item']}>
      <ProductImage
        link={product.image.link}
        className={s['product-item__image']}
        onClick={getProductCard as VoidFunction}
        disabled={isPending}
      />
      <div className={productInfoClassList} onClick={getProductCard as VoidFunction}>
        <Text as='p' size='xs' className={s['shop-name']} family='secondary'>
          {product?.shop?.name}
        </Text>
        <AffiliateDiscountPercentage discount={product.discountPercentage} />
        <ProductName name={product.name} />
        <ProductPrice discountPrice={product.price} />
      </div>
      <HexagonalButton
        className={cx(s['product-item__affiliate-button'], 'offset-top-12')}
        onClick={productJoinHandler}
        active={!connected}
        small={isSmall}
        fluid={!isSmall}
      >
        {connected ? 'Подключено' : 'Подключиться'}
      </HexagonalButton>

      <ConnectAffiliateProgramModal
        isOpen={Boolean(connectProduct)}
        onClose={clearConnectProduct}
        data={connectProduct}
        onSuccess={handleSuccessJoin}
      />
      <SuccessJoinProductModal isOpen={Boolean(shortLinkCode)} onClose={handleCloseSuccessModal} code={shortLinkCode} />
      <PreviewCard isOpen={Boolean(previewCard)} onClose={clearPreviewCard} data={previewCard} />
    </div>
  )
}
