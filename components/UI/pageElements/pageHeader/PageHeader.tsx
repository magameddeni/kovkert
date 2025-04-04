import React, { FC, PropsWithChildren } from 'react'
import cx from 'classnames'
import { Text } from '../../index'
import s from './style.module.scss'

interface IPageHeaderProps extends PropsWithChildren {
  title: string | undefined
  button?: React.ReactNode
  className?: string
  withBorder?: boolean
}

const PageHeader: FC<IPageHeaderProps> = ({ children, title, button, className, withBorder = true }) => (
  <div className={cx(s['page-header'], { [s['with-border']]: withBorder }, className)}>
    <div className={s['page-header__top']}>
      <Text as='h1'>{title}</Text>
      {button}
    </div>
    {children && <div className='offset-top-8'>{children}</div>}
  </div>
)

export default PageHeader
