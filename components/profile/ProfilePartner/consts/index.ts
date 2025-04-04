import { EOrderStatus } from '@/components/UI/StatusLabel/StatusLabel'

export enum PartnersTabKeys {
  Active = 'active',
  Archived = 'archived',
  Withdrawals = 'withdrawals'
}

export const paymentStatus = {
  Pending: EOrderStatus.WAITING_FOR_PAID,
  Completed: EOrderStatus.DONE
}
export type Withdrawal = {
  _id: string
  createdAt: string
  amount: number
  status: string
}
