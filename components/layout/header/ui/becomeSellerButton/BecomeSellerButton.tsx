import React from 'react'
import Link from 'next/link'
import { SELLER_URL } from '@/constants'
import { Icon, Text } from '@/components/UI'
import s from './become-seller-button.module.scss'

const BecomeSellerButton = () => (
  <Link href={SELLER_URL} target='_blank'>
    <div className={s['become-seller-button']}>
      <Icon name='store-stretch' color='light-blue' size='sm' />
      <Text color='blue' size='xxs' family='secondary'>
        Стать продавцом
      </Text>
    </div>
  </Link>
)

export default BecomeSellerButton
