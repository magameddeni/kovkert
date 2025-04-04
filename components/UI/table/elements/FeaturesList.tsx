import React from 'react'
import { Row } from '@tanstack/react-table'
import { Icon, Text } from 'components/UI'
import { ITableRowFeatures } from '../model'
import s from './elements.module.scss'
import { TableTooltip } from './tableTooltip'

interface IFeaturesListProps<T> {
  row: Row<T>
  features: ITableRowFeatures<T>[]
}

const FeaturesList = <T,>({ row, features }: IFeaturesListProps<T>) => (
  <TableTooltip iconSize='xs' closeAfterClickOnContent>
    <div className={s['features-list']}>
      {features.map((feature: ITableRowFeatures<T>) => (
        <div
          key={feature.text}
          className={s['features-list__item']}
          onClick={() => (feature?.onClick ? feature.onClick(row.original) : {})}
        >
          <Icon className={s.icon} name={feature.icon} size='md' />
          <Text className={s.text} size='sm'>
            {feature.text}
          </Text>
        </div>
      ))}
    </div>
  </TableTooltip>
)

export default FeaturesList
