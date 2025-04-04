import React from 'react'
import { Text } from 'components/UI'
import { IUser } from '@/models'

interface IPaymentContentProps {
  paymentData: { createdAt: string; user: IUser; amount: number }
}

function formatDateTime(input: string) {
  const date = new Date(input)

  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }
  const formattedDate = date.toLocaleDateString('ru-RU', options).replace('.', '')

  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const formattedTime = `${hours}:${minutes}`

  return {
    date: formattedDate,
    time: formattedTime
  }
}
const PaymentContent = ({ paymentData }: IPaymentContentProps) => (
  <>
    <div>
      <Text as='p' size='xs' color='middle-grey' className='offset-top-4' family='secondary' weight='regular'>
        Баллы
      </Text>
      <Text size='xxxl'>{paymentData?.amount}</Text>
    </div>

    <div>
      <Text as='p' size='xs' color='middle-grey' className='offset-top-4' family='secondary' weight='regular'>
        Получатель
      </Text>
      <Text size='md'>
        {paymentData?.user?.lastName} {paymentData?.user?.name} {paymentData?.user?.patronymic || ''}
      </Text>
    </div>

    <div>
      <Text as='p' size='xs' color='middle-grey' className='offset-top-4' family='secondary' weight='regular'>
        Дата
      </Text>
      <Text size='md'>{formatDateTime(paymentData?.createdAt).date}</Text>
    </div>

    <div>
      <Text as='p' size='xs' color='middle-grey' className='offset-top-4' family='secondary' weight='regular'>
        Время
      </Text>
      <Text size='md'>{formatDateTime(paymentData?.createdAt).time}</Text>
    </div>
  </>
)

export default PaymentContent
