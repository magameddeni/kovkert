import React from 'react'
import { statusButtonColors } from '@/constants'
import { isWaitingForPayStatus } from '@/utils/isWaitingForPayStatus'
import s from './order-status.module.scss'

interface IOrderStatusProps {
  status: string
}

const OrderStatus = ({ status }: IOrderStatusProps) => (
  <div
    className={s['order-status']}
    style={{
      background: isWaitingForPayStatus(status) ? '#FFECD9' : statusButtonColors?.[status]?.background ?? '#ebebeb',
      color: isWaitingForPayStatus(status) ? '#FF8615' : statusButtonColors?.[status]?.color ?? '#000000'
    }}
  >
    {status}
  </div>
)

export default OrderStatus
