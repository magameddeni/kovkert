import React, { FC } from 'react'
import cx from 'classnames'
import { IFilter } from '@/models'
import CheckboxFilter from './CheckboxFilter'
import RadioFilter from './RadioFilter'
import PriceRangeFilter from './PriceRangeFilter'
import s from './filters.module.scss'

interface FiltersProps {
  filters: IFilter[]
  className?: string
}

const Components = {
  string: CheckboxFilter,
  boolean: RadioFilter,
  number: CheckboxFilter,
  slider: PriceRangeFilter
} as unknown as {
  [name: string]: FC
}

export const Filters = ({ filters, className }: FiltersProps) => {
  if (!filters?.length) return null

  return (
    <div className={cx(s.filters, className)}>
      {filters.map((v: IFilter) => {
        if (Components[v.type] as any) {
          return React.createElement(Components[v.type], {
            key: v.key,
            data: v
          } as any)
        }

        return React.createElement(() => <div>{v.type} | NULL</div>, {
          key: v.key
        })
      })}
    </div>
  )
}
