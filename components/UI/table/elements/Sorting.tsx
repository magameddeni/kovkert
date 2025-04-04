import React from 'react'
import { Header, RowData } from '@tanstack/react-table'
import cx from 'classnames'
import { Icon } from 'components/UI'
import s from './elements.module.scss'

interface ISortingProps {
  header: Header<RowData | any, unknown>
}

const Sorting = ({ header }: ISortingProps) => {
  const iconNames = {
    asc: 'arrow-top',
    desc: 'arrow-bottom',
    false: ''
  } as Record<string, string>

  return (
    <div className={s.sorting}>
      <Icon size='xs' name={iconNames[header.column.getIsSorted() as string]} />
      <Icon
        size='xs'
        color='middle-grey'
        name={iconNames.asc}
        className={cx(s['sorting__icon-hidden'], s['sorting__icon-hidden-asc'])}
      />
      <Icon size='xs' color='middle-grey' name={iconNames.desc} className={s['sorting__icon-hidden']} />
    </div>
  )
}

export default Sorting
