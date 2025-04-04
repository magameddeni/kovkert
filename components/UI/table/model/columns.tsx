import React from 'react'
import { Row } from '@tanstack/react-table'
import { FeaturesList } from '../elements'
import { defaultColumnMinWidth, FEATURE_LIST_COLUMN_ID } from '../const'

export interface ITableRowFeatures<T> {
  icon: string
  text: string
  onClick: (data: T) => void
}

export const featuresListColumn = <T,>(rowFeatures: (payload?: T) => ITableRowFeatures<T>[]) => ({
  id: FEATURE_LIST_COLUMN_ID,
  size: defaultColumnMinWidth,
  enableResizing: false,
  cell: ({ row }: { row: Row<T> }) => <FeaturesList row={row} features={rowFeatures(row.original)} />
})
