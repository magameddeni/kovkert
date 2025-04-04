import React, { PropsWithChildren } from 'react'
import cx from 'classnames'

interface IRowProps extends PropsWithChildren {
  className?: string
  style?: React.CSSProperties
  row?: 16 | 20 | 32
  align?: 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'end' | 'space-between'
  small?: boolean
}

const Row = ({ children, className, style, row, align, justify, small }: IRowProps) => {
  const classList = cx(
    'row',
    {
      [`row-${row}`]: row,
      [`align-items-${align}`]: align,
      [`justify-content-${justify}`]: justify,
      small
    },
    className
  )

  return (
    <div className={classList} style={style}>
      {children}
    </div>
  )
}

export default Row
