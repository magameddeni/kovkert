import React from 'react'
import { Text } from 'components/UI'
import useMediaQuery from '@/components/Hooks/useMediaQuery'
import s from './style.module.scss'
import { IStatisticsData } from '../types'

const CustomLegend = ({ data }: { data: IStatisticsData }) => {
  const isMobile = useMediaQuery('(max-width:767px)')
  return (
    <div className={s['custom-legend']}>
      <div className={s['custom-legend__ordered']}>
        <Text size={isMobile ? 'xs' : 'sm'} className={s['custom-legend__title']} as='p' weight='medium' align='center'>
          {data.secondLabel}
        </Text>
        <Text size={isMobile ? 'xs' : 'md'} as='p' weight='medium' align='start'>
          {data.totalForSecondLabel} {data?.isCurrencyLabel && '₽'}
        </Text>
      </div>
      <div className={s['custom-legend__delivered']}>
        <Text size={isMobile ? 'xs' : 'sm'} as='p' className={s['custom-legend__title']} weight='medium' align='center'>
          {data.firstLabel}
        </Text>
        <Text size={isMobile ? 'xs' : 'md'} as='p' weight='medium' align='start'>
          {data.totalForFirstLabel} {data?.isCurrencyLabel && '₽'}
        </Text>
      </div>
    </div>
  )
}

export default CustomLegend
