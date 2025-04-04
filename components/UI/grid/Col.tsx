import React, { PropsWithChildren } from 'react'
import cn from 'classnames'
import { mediaBreakpoints } from '@/constants/grid'

interface IColProps extends PropsWithChildren {
  className?: string
  style?: React.CSSProperties
  [rest: string]: any
}

const Col = ({ children, className, style, ...rest }: IColProps) => {
  const cls = []
  let bk
  let val

  // add col classes
  const breakpoints = Object.keys(mediaBreakpoints)
  for (let i = breakpoints.length - 1; i > -1; i--) {
    bk = breakpoints[i]

    // add col-{bk}-{val}
    val = rest[bk]
    if (val) cls.push(`col-${bk}-${val}`)

    // add offset-{bk}-{val}
    val = rest[`offset-${bk}`]
    if (val >= 0) cls.push(`offset-${bk}-${val}`)

    // add order-{bk}-{val}
    val = rest[`order-${bk}`]
    if (val >= 0) cls.push(`order-${bk}-${val}`)

    // remove from rest
    delete rest[bk]
    delete rest[`offset-${bk}`]
    delete rest[`order-${bk}`]
  }

  const classList = cn('col', cls, className)

  return (
    <div className={classList} style={style} {...rest}>
      {children}
    </div>
  )
}

export default Col
