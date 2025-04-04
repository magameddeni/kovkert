import React, { useState } from 'react'
import { calculateSalePrice } from '@/utils/calculateSalePrice'
import { Text, Gap } from '@/components/UI'
import s from '@/components/profile/ProfilePartner/modals/ChangeDiscountModal/styles.module.scss'

interface DistributeAffiliateDiscountProps {
  productDiscount: number
  productPrice: number
  discountChangeHandler?: (discount: number) => void
}

export const DistributeAffiliateDiscount = ({
  productDiscount,
  productPrice,
  discountChangeHandler
}: DistributeAffiliateDiscountProps) => {
  const [discount, setDiscount] = useState(String(Math.floor(productDiscount / 2)))

  const handleChangeDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setDiscount(value)
    discountChangeHandler?.(+value)
  }

  return (
    <div>
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
          id='priceRange'
          className={s.ChangeDiscountModal__priceSlider}
          type='range'
          min='0'
          max={productDiscount}
          value={discount}
          onChange={handleChangeDiscount}
        />
        <Text weight='bold' size='xxxs' color='red'>
          {productDiscount - Number(discount)}%
        </Text>
      </div>
      <Gap size={8} />
      <div className={s.ChangeDiscountModal__label}>
        <Text weight='bold' size='xxxs' color='gray'>
          {calculateSalePrice(productPrice, Number(discount))}
        </Text>
        <Text weight='bold' size='xxxs' color='gray'>
          {calculateSalePrice(productPrice, productDiscount - Number(discount))}
        </Text>
      </div>
    </div>
  )
}
