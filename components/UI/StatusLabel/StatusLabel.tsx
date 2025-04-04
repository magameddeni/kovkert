import React from 'react'
import cx from 'classnames'
import { Text } from 'components/UI'
import s from './styles.module.scss'

export enum EOrderStatus {
  CREATED = 'Создан',
  PAID = 'Оплачено',
  CANCELLED_BY_CUSTOMER = 'Отменено покупателем',
  CANCELLED_BY_SELLER = 'Отменено продавцом',
  BEING_ASSEMBLED = 'В сборке',
  DELIVERED = 'Доставлено',
  // статусы для Партнерской программы
  WAITING_FOR_PAID = 'Ожидает оплаты',
  DONE = 'Завершено'
}

interface StatusLabelProps {
  status: EOrderStatus
  className?: string
}

const StatusLabel: React.FC<StatusLabelProps> = ({ status, className }) => {
  const classNameStatus = {
    Создан: 'create',
    Оплачено: 'paid',
    'В сборке': 'in-progress',
    'В доставке': 'in-delivery',
    Доставлено: 'delivered',
    'Отменено покупателем': 'canceled-buyer',
    'Отменено продавцом': 'canceled-seller',
    // статусы для Партнерской программы
    'Ожидает оплаты': 'in-progress',
    Завершено: 'paid'
  }

  return (
    <Text size='xxs' className={cx(s['order-status-label'], s[classNameStatus[status]], className)}>
      {status}
    </Text>
  )
}
export default StatusLabel
