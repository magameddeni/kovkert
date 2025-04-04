import React from 'react'
import moment from 'moment'
import { StatusLabel, Gap } from '@/components/UI'
import { useQueryParams } from '@/hooks'
import s from './styles.module.scss'
import { paymentStatus, Withdrawal } from '../../../consts'
import { UnderlinedLabelValue } from '../../UnderlinedLabelValue'

interface BlockInfoProps {
  withdrawal: Withdrawal
}

const BlockInfo: React.FC<BlockInfoProps> = ({ withdrawal }) => {
  const { setQuery } = useQueryParams()

  return (
    <div className={s.BlockInfo} onClick={() => setQuery({ receipt: withdrawal._id })}>
      <UnderlinedLabelValue label='Дата создания чека' value={moment(withdrawal?.createdAt).format('DD.MM.YY')} />
      <Gap size={4} />
      <UnderlinedLabelValue label='Сумма' value={String(withdrawal?.amount)} />
      <Gap size={8} />
      <div className={s.BlockInfo__status}>
        <StatusLabel status={paymentStatus[withdrawal?.status as keyof typeof paymentStatus]} />
      </div>
    </div>
  )
}

export default BlockInfo
