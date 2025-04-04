import React, { useEffect, useMemo, useState } from 'react'
import { Text, Gap } from '@/components/UI'
import { DEFAULT_PRODUCT_PATH } from '@/constants'
import s from './styles.module.scss'
import { UnderlinedLabelValue } from '../../parts/UnderlinedLabelValue'
import { useWithdrawalDetails } from '../../hooks'

function formatDateTime(input: string): { date: string; time: string } {
  const date = new Date(input)
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  const formattedDate = date.toLocaleDateString('ru-RU', dateOptions).replace('.', '')
  const formattedTime = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })
  return {
    date: formattedDate,
    time: formattedTime
  }
}

interface CheckModalProps {
  selectedWithdrawalId: string
}

const CheckModal: React.FC<CheckModalProps> = ({ selectedWithdrawalId }) => {
  const [imageSrc, setImageSrc] = useState('')

  const { withdrawalData } = useWithdrawalDetails({ withdrawalId: selectedWithdrawalId })

  useEffect(() => {
    if (withdrawalData?.image?.link) setImageSrc(withdrawalData?.image?.link)
  }, [withdrawalData])

  const { date, time } = useMemo(() => formatDateTime(withdrawalData?.createdAt), [withdrawalData])

  return (
    <div className={s.CheckModal}>
      <Text align='center' weight='medium'>
        Баллы
      </Text>
      <Gap size={8} />

      <Text align='center' as='h3'>
        {withdrawalData?.amount}
      </Text>
      <Gap size={16} />
      <div className={s.CheckModal__productInfo}>
        <img
          className={s.CheckModal__img}
          src={imageSrc}
          alt='product'
          onError={() => setImageSrc(DEFAULT_PRODUCT_PATH)}
        />
        <Text size='xl'>{withdrawalData.name}</Text>
      </div>
      <Gap size={16} />

      <UnderlinedLabelValue
        label='Получатель'
        value={`${withdrawalData?.user?.lastName} ${withdrawalData?.user?.name} ${withdrawalData?.user?.patronymic}`}
      />
      <Gap size={8} />
      <UnderlinedLabelValue label='Дата' value={date} />
      <Gap size={8} />
      <UnderlinedLabelValue label='Время' value={time} />
      <Gap size={8} />
      <UnderlinedLabelValue label='Количество продаж' value={withdrawalData?.sales} />
      <Gap size={8} />
      <UnderlinedLabelValue label='Просмотры' value={withdrawalData?.clicks} />

      <Gap size={16} />
      <Text>Ссылка на чек</Text>
      <Gap size={8} />
      <div className={s.CheckModal__check}>
        <Text>
          {window.origin}/partner/?filter=active&receipt={withdrawalData?._id}
        </Text>
      </div>
    </div>
  )
}
export default CheckModal
