import React from 'react'
import { Button, Text } from '@/components/UI'
import { useWindowSize } from '@/hooks'
import Maps from '@/components/Map'
import s from './pvz.module.scss'

interface AddressPvzProps {
  coordinates: Array<number>
  address: string
  phoneNumber: string
  onRequestClose: VoidFunction
}

const AddressPVZ: React.FC<AddressPvzProps> = ({ coordinates, address, phoneNumber, onRequestClose }) => {
  const { isSmall } = useWindowSize()

  return (
    <div className={s.pvz}>
      {!isSmall && (
        <Text size='xxl' align='center' as='div' className='offset-top-48'>
          Пункт выдачи
        </Text>
      )}
      <div className={s.pvz__map}>
        <Maps coordinates={coordinates} width='100%' height='100%' />
      </div>
      <div className={s.pvz__shop_information}>
        {isSmall && (
          <Text size='xxl' as='div'>
            Пункт выдачи
          </Text>
        )}
        <div className={s.pvz__address}>
          <div className={s.pvz__address_title}>Адрес</div>
          <div className={s.pvz__address_fullname}>{address}</div>
        </div>
        <div className={s.pvz__phone}>
          <div className={s.pvz__phone_title}>Телефон</div>
          <div className={s.pvz__phone_number}>
            <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
          </div>
        </div>
        <Button onClick={onRequestClose} fluid className={s['pvz__mobile_close-btn']}>
          Закрыть
        </Button>
      </div>
    </div>
  )
}
export default AddressPVZ
