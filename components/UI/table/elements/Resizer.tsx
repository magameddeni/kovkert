import React, { FC } from 'react'
import { Header, RowData } from '@tanstack/react-table'
import cx from 'classnames'
import s from './elements.module.scss'

interface IResizerProps {
  table: any
  header: Header<RowData | any, unknown>
}

const Resizer: FC<IResizerProps> = ({ table, header }) => (
  <div
    {...{
      onDoubleClick: () => header.column.resetSize(),
      onMouseDown: header.getResizeHandler(),
      onTouchStart: header.getResizeHandler(),
      className: cx(s.resizer, s[table.options.columnResizeDirection], {
        [s['is-resizing']]: header.column.getIsResizing(),
        [s.disabled]: !header.column.getCanResize()
      })
    }}
    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    }}
  />
)

export default Resizer
