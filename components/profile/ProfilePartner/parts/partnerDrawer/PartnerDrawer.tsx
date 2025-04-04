import React, { useEffect, useState } from 'react'
import { BarChart, Button, DateFilter, Divider, Icon, Row, Text, If, Gap, GapPosition } from 'components/UI'
// import { OrderDateFilter } from 'components/filters'
import moment from 'moment'
import { DEFAULT_PRODUCT_PATH } from '@/constants'
import { useCurrentSiteUrl, useMessage, useWindowSize } from '@/hooks'
import { copyText } from '@/utils/copyText'
import { getFixedNumber } from '@/utils/getFixedNumber'
import { TableContent } from './parts'
import { useGetProgramDetail, useGetStatistics } from '../../hooks'
import { InfoItem } from './InfoItem'
import { BlockInfo } from './BlockInfo'
import { Withdrawal } from '../../consts'
import s from './partner-drawer.module.scss'

interface IPartnerDrawerProps {
  programId: string
  affiliateLinkId: string
  shopId: string
  setIsChangeDiscountModalOpen: (val: boolean) => void
  setIsWriteOffModalModalOpen: (val: boolean) => void
}

interface IPeriodValue {
  startDate: string
  endDate: string
}

const PartnerDrawer = ({
  programId,
  affiliateLinkId,
  shopId,
  setIsChangeDiscountModalOpen,
  setIsWriteOffModalModalOpen
}: IPartnerDrawerProps) => {
  const { isLarge } = useWindowSize()
  const { headerData, withdrawals } = useGetProgramDetail({
    programId,
    affiliateLinkId,
    shopId
  })

  const [imageSrc, setImageSrc] = useState(headerData?.productImage ?? DEFAULT_PRODUCT_PATH)
  const [periodValue, setPeriodValue] = useState<IPeriodValue | null>(null)
  const { siteUrl } = useCurrentSiteUrl(`/p/${headerData?.shortLinkCode}`)

  const onDateChange = (startDate: string | null, endDate?: string) => {
    setPeriodValue(
      startDate && endDate
        ? { startDate: moment(startDate).format('YYYY-MM-DD'), endDate: moment(endDate).format('YYYY-MM-DD') }
        : null
    )
  }

  const { statistics } = useGetStatistics({ programId, ...periodValue })

  useEffect(() => {
    setImageSrc(headerData?.productImage)
  }, [headerData?.productImage])

  const copyLink = () => {
    void copyText(siteUrl)
    useMessage('Ссылка скопирована!', 'success', 'Готово')
  }

  const discountDistributionElemenet = (
    <div onClick={() => setIsChangeDiscountModalOpen(true)} className={s['partner-drawer__content__dotted-underline']}>
      <Text size={isLarge ? 'lg' : 'xs'} weight='medium' family='secondary'>
        {headerData.discountForBuyer}%
      </Text>{' '}
      <Text size={isLarge ? 'lg' : 'xs'} weight='medium' family='secondary' color='usual-gray'>
        /
      </Text>{' '}
      <Text size={isLarge ? 'lg' : 'xs'} weight='medium' family='secondary'>
        {headerData.discountForPartner}%
      </Text>
    </div>
  )

  const balanceElement = (
    <div onClick={() => setIsWriteOffModalModalOpen(true)} className={s['partner-drawer__content__dotted-underline']}>
      <Text size={isLarge ? 'lg' : 'xs'} weight='medium' family='secondary'>
        {getFixedNumber(Number(headerData.earnings))}
      </Text>{' '}
      <Icon size='xs' name='arrow-bottom' />
    </div>
  )
  return (
    <div className={s['partner-drawer']}>
      <If condition={Boolean(headerData?.productName)}>
        <div className={s['partner-drawer__header']}>
          <div className={s['partner-drawer__header__container']}>
            <img
              className={s['partner-drawer__header__img']}
              src={imageSrc}
              alt='product'
              onError={() => setImageSrc(DEFAULT_PRODUCT_PATH)}
            />
            <Text size='xl'>{headerData?.productName}</Text>
            {isLarge ? (
              <Button
                style={{ marginLeft: 4, whiteSpace: 'nowrap', height: 'fit-content' }}
                size='xs'
                color='white'
                onClick={copyLink}
                className={s['partner-drawer__header__copyButton']}
              >
                Скопировать ссылку
              </Button>
            ) : (
              <Icon onClick={copyLink} name='duplicate' />
            )}
          </div>
        </div>
      </If>
      <div className={s['partner-drawer__content']}>
        <div className={s['partner-drawer__content__info']}>
          <If condition={Boolean(headerData?.discountPercentage || headerData.earnings)}>
            <Row justify='space-between' style={{ margin: '0px 10px 10px 10px' }}>
              <Row>
                <InfoItem title={isLarge ? 'Скидка селлера' : 'Скидка'} value={`${headerData.discountPercentage}%`} />
                <Gap position={GapPosition.Horizontal} size={isLarge ? 32 : 16} />
                <InfoItem
                  title={isLarge ? 'Распределение скидки' : 'Распределение'}
                  value={discountDistributionElemenet}
                />
                <Gap position={GapPosition.Horizontal} size={isLarge ? 32 : 16} />
                <InfoItem
                  title={isLarge ? 'Мое вознаграждение' : 'вознаграждение'}
                  value={`${getFixedNumber(headerData?.reward)} ₽`}
                />
              </Row>
              <Row>
                <If condition={isLarge as unknown as boolean}>
                  <Divider orientation='vertical' />
                  <Gap position={GapPosition.Horizontal} size={24} />
                </If>
                <InfoItem alignValue='end' title='Баланс' value={headerData.earnings ? balanceElement : '0 ₽'} />
              </Row>
            </Row>
            <Divider orientation='horizontal' />
          </If>
          {isLarge ? (
            <TableContent withdrawals={withdrawals} />
          ) : (
            <>
              {withdrawals?.map((withdrawal: Withdrawal) => <BlockInfo key={withdrawal._id} withdrawal={withdrawal} />)}
              <If condition={!withdrawals?.length}>
                <Text className={s['partner-drawer__noContent']}>Не пришли данные</Text>
              </If>
            </>
          )}
        </div>
        <div className={s['partner-drawer__content__chart']}>
          <BarChart height='288px' data={statistics} />
          <div className={s['partner-drawer__content__chart-date']}>
            <DateFilter label='Период' onFilterChange={onDateChange} disabled={false} position='right' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerDrawer
