import React, { PropsWithChildren } from 'react'
import cx from 'classnames'
import { Panel } from './Panel'
import s from './style.module.scss'

interface ICollapseProps extends PropsWithChildren {
  className?: string
}

const Collapse = React.memo(({ children, className }: ICollapseProps) => (
  <div className={cx(s.collapse, className)}>{children}</div>
))

export default Object.assign(Collapse, {
  Panel
})
