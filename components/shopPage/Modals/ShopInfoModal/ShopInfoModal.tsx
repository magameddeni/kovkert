import React from 'react'
import { IStore } from '@/models'
import { setSpaceBetweenCharacters, yearDeclension } from '@/helpers'
import { Icon, Text } from '@/components/UI'
import { yearsElapsedFromDateString } from '@/helpers/yearsElapsed'
import s from './shop-info-modal.module.scss'

interface IShopInfoModalProps {
  shop: IStore
}

export const ShopInfoModal = ({ shop }: IShopInfoModalProps) => {
  const yearsElapsed = yearsElapsedFromDateString(shop.createdAt)

  return (
    <div className={s['shop-info-modal']}>
      <Text as='h3' align='center'>
        {shop.name}
      </Text>
      <div className='offset-top-40'>
        <div className={s['block-info']}>
          <div className={s['block-info__statistics']}>
            <Icon name='store' />
            <Text as='p' family='secondary'>
              {yearsElapsed.toString()} {yearDeclension(yearsElapsed)}
              <Text color='gray' weight='regular'>
                на Kovkert
              </Text>
            </Text>
          </div>
        </div>
        <div className={s['block-info']}>
          <div className={s['block-info__statistics']}>
            <Icon name='box' />
            <Text as='p' family='secondary'>
              {setSpaceBetweenCharacters(shop.allSoldItemsCount)}
              <Text color='gray' weight='regular'>
                проданных товаров
              </Text>
            </Text>
          </div>
          {shop.rating && (
            <div className={s['block-info__statistics']}>
              <Icon name='like' />
              <Text as='p' family='secondary'>
                {shop.rating}
                <Text color='gray' weight='regular'>
                  средняя оценка
                </Text>
              </Text>
            </div>
          )}
        </div>
        <div className={s['block-info']}>
          <div className={s['block-info__legal-info']}>
            <Text>{shop.fullName}</Text>
          </div>
          <div className={s['block-info__legal-info']}>
            <Text>Адрес: {shop.addresses?.[0]?.fullname}</Text>
          </div>
          <div className={s['block-info__legal-info']}>
            <Text>ОГРН: {shop.ogrn}</Text>
          </div>
          <div className={s['block-info__legal-info']}>
            <Text>E-mail: {shop.email}</Text>
          </div>
        </div>
      </div>
    </div>
  )
}
