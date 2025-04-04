import React, { useState } from 'react'
import { Button, Row, Text, Gap, GapPosition } from '@/components/UI'
import { calculateSalePrice } from '@/utils/calculateSalePrice'
import { If } from '@/components/UI/If'
import { useWindowSize } from '@/hooks'
import s from './styles.module.scss'
import { useChangeDiscountProgram, useGetProgramDetail } from '../../hooks'

interface ChangeDiscountModalProps {
  closeChangeDiscountModal: VoidFunction
  programId: string
  affiliateLinkId: string
  shopId: string
}

const ChangeDiscountModal: React.FC<ChangeDiscountModalProps> = ({
  closeChangeDiscountModal,
  programId,
  affiliateLinkId,
  shopId
}) => {
  const { isSmall } = useWindowSize()
  const { headerData, refetchDetails } = useGetProgramDetail({
    programId,
    affiliateLinkId,
    shopId
  })
  const [discount, setDiscount] = useState(String(headerData?.discountForBuyer))

  const handleClose = () => {
    closeChangeDiscountModal()
    refetchDetails()
  }
  const { mutate } = useChangeDiscountProgram({ closeChangeDiscountModal: handleClose })

  const onSubmit = async () => {
    mutate({
      linkId: affiliateLinkId,
      discountForBuyer: Number(discount),
      discountForPartner: headerData?.discountPercentage - Number(discount)
    })
  }

  return (
    <div className={s.ChangeDiscountModal}>
      <Text as='h4'>Распределение скидки</Text>
      <Gap size={24} />
      <div className={s.ChangeDiscountModal__label}>
        <Text weight='bold' size='xxxs' color='red'>
          Покупателю
        </Text>
        <Text weight='bold' size='xxxs' color='red'>
          Мне
        </Text>
      </div>
      <Gap size={8} />
      <div className={s.ChangeDiscountModal__priceSliderWrapper}>
        <Text weight='bold' size='xxxs' color='red'>
          {discount}%
        </Text>
        <input
          type='range'
          min='0'
          max={headerData?.discountPercentage}
          value={discount}
          id='priceRange'
          onChange={(e) => setDiscount(e.target.value)}
          className={s.ChangeDiscountModal__priceSlider}
        />
        <Text weight='bold' size='xxxs' color='red'>
          {headerData?.discountPercentage - Number(discount)}%
        </Text>
      </div>
      <If condition={!isSmall}>
        <Gap size={8} />
        <div className={s.ChangeDiscountModal__label}>
          <Text weight='bold' size='xxxs' color='gray'>
            {calculateSalePrice(headerData.price, Number(discount))}
          </Text>
          <Text weight='bold' size='xxxs' color='gray'>
            {calculateSalePrice(headerData.price, headerData?.discountPercentage - Number(discount))}
          </Text>
        </div>
      </If>
      <Gap size={32} />
      {isSmall ? (
        <Button onClick={onSubmit} fluid>
          Сохранить
        </Button>
      ) : (
        <Row justify='end'>
          <Button view='link' className={s.ChangeDiscountModal__link} onClick={closeChangeDiscountModal}>
            Закрыть
          </Button>
          <Gap size={16} position={GapPosition.Horizontal} />
          <Button onClick={onSubmit}>Сохранить</Button>
        </Row>
      )}
    </div>
  )
}

export default ChangeDiscountModal
