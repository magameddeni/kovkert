import React from 'react'

import { Text } from '@/components/UI'

import { useWindowSize } from '@/hooks'
import s from './styles.module.scss'

interface InfoItemProps {
  title: string
  value: string | React.ReactNode
  alignValue?: 'start' | 'end' | 'center' | 'justify'
}

const InfoItem: React.FC<InfoItemProps> = ({ title, value, alignValue = 'start' }) => {
  const { isLarge } = useWindowSize()

  return (
    <div className={s.InfoItem}>
      <Text size='xxxs' color='middle-grey' weight='medium' align={alignValue} className={s.InfoItem__title}>
        {title}
      </Text>
      <Text
        size={isLarge ? 'lg' : 'xs'}
        weight='medium'
        align={alignValue}
        family='secondary'
        className={s.InfoItem__value}
      >
        {value}
      </Text>
    </div>
  )
}
export default InfoItem
