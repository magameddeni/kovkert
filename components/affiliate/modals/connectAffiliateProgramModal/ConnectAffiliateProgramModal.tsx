import React, { useEffect, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useMessage, useWindowSize } from '@/hooks'
import { ProductAffiliate } from '@/models'
import { ProductImage, ProductName, ProductPrice } from '@/components/product'
import { AffiliateDiscountPercentage, DistributeAffiliateDiscount } from '@/components/affiliate'
import { Button, ButtonGroup, Divider, Gap, If, Modal, Text } from '@/components/UI'
import $api from '@/components/Http/axios'
import styles from './connect-affiliate-program-modal.module.scss'

interface ConnectAffiliateProgramModalProps {
  isOpen: boolean
  onClose: VoidFunction
  data: ProductAffiliate | undefined
  onSuccess: (shortLinkCode: string) => void
}

export const ConnectAffiliateProgramModal = ({
  isOpen,
  onClose,
  data,
  onSuccess
}: ConnectAffiliateProgramModalProps) => {
  const [discounts, setDiscounts] = useState<Array<number>>([])
  const { isLarge, isSmall } = useWindowSize()

  const initDiscount = useMemo(() => {
    if (data?.discountPercentage) {
      const discountForBuyer = Math.floor(data.discountPercentage / 2)
      const discountForPartner = data.discountPercentage - discountForBuyer
      return [discountForBuyer, discountForPartner]
    }

    return []
  }, [data])

  const { mutate: productAffiliateJoin, isPending } = useMutation({
    mutationFn: async () =>
      $api.post(`api/affiliate/links/join`, {
        programId: data?._id,
        discountForBuyer: discounts[0],
        discountForPartner: discounts[1]
      }),
    onSuccess: (responseDate) => {
      onSuccess(responseDate?.data?.shortLinkCode)
    },
    onError: (err: any) => {
      useMessage(err?.response?.data?.error ?? 'Нельзя подключиться к товару', 'error')
    }
  })

  const handleChangeDiscount = (discount: number) => {
    if (data) {
      setDiscounts([discount, data.discountPercentage - discount])
    }
  }

  useEffect(() => setDiscounts(initDiscount), [data])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      wrapperClassName={styles['connect-affiliate-program-modal']}
      closePlace={isLarge ? 'right' : 'uptop-right'}
    >
      {data && (
        <div className={styles['connect-affiliate-program']}>
          <Text
            as='p'
            size='xl'
            className={styles['connect-affiliate-program__title']}
            family='secondary'
            align='center'
          >
            Партнерская программа
          </Text>
          <div className={styles['connect-affiliate-program__content']}>
            <div className={styles['main-info']}>
              <ProductImage className={styles['main-info__image']} link={data.image.link} asLink={false} />
              <div className={styles['main-info__text']}>
                {!isSmall && <AffiliateDiscountPercentage discount={data.discountPercentage} />}
                <ProductName name={data.name} className={styles['product-title']} />
                {!isSmall && <ProductPrice discountPrice={data.price} />}
              </div>
            </div>
            {isSmall && (
              <div className={styles['discount-mobile']}>
                <AffiliateDiscountPercentage
                  discount={data.discountPercentage}
                  className={styles['discount-percentage']}
                />
                <ProductPrice discountPrice={data.price} />
              </div>
            )}
            <If condition={isSmall}>
              <Gap size={16} />
              <Divider orientation='horizontal' />
            </If>
            <div className={styles['change-discount']}>
              <Text size='md'>Распределите скидку</Text>
              <Gap size={16} />
              <DistributeAffiliateDiscount
                productDiscount={data.discountPercentage}
                productPrice={data.price}
                discountChangeHandler={handleChangeDiscount}
              />
            </div>
          </div>
          <ButtonGroup justifyContent='end' gap={8}>
            {isLarge && (
              <Button view='link' onClick={onClose}>
                Отмена
              </Button>
            )}
            <Button
              onClick={productAffiliateJoin}
              disabled={isPending}
              className={styles['button-connect']}
              fluid={isSmall}
            >
              Подключить
            </Button>
          </ButtonGroup>
        </div>
      )}
    </Modal>
  )
}
