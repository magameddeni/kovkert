import { Table } from '@/components/UI/table'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { StatusLabel } from '@/components/UI'
import moment from 'moment'
import { useQueryParams } from '@/hooks'
import { TPartnerProgramList } from '../../DetailedTable/DetailedTable'
import { paymentStatus } from '../../../consts'

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'index',
    header: '№',
    size: 44,
    enableSorting: false
  },
  {
    accessorKey: 'createdAt',
    header: 'Дата создания чека',
    size: 180,
    minSize: 180,
    cell: (info: CellContext<TPartnerProgramList, unknown>) => moment(info?.getValue() as string).format('DD.MM.YY')
  },
  {
    accessorKey: 'amount',
    header: 'Сумма',
    size: 100,
    minSize: 100
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    size: 190,
    minSize: 190,
    cell: (info: CellContext<TPartnerProgramList, unknown>) => (
      <StatusLabel status={paymentStatus[info?.getValue() as keyof typeof paymentStatus]} />
    )
  }
]

interface IPartnerTableContent {
  withdrawals: { _id: string; createdAt: string; amount: number; status: string }[]
}

const TableContent = ({ withdrawals }: IPartnerTableContent) => {
  const { setQuery } = useQueryParams()

  return (
    <Table
      defaultData={withdrawals}
      defaultColumns={columns}
      resize
      fluid
      onRowClick={(data) => setQuery({ receipt: data._id })}
    />
  )
}

export default TableContent
