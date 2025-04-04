import React, { PropsWithChildren } from 'react'
import cx from 'classnames'
import { IColor, ISize } from '@/models'

export interface IIconProps extends ISize, IColor, PropsWithChildren {
  name?: string
  className?: string
  style?: React.CSSProperties
  title?: string
  hoverColor?: 'gray'
  onClick?: ((data?: any) => void) | undefined
  onBlur?: VoidFunction
  disable?: boolean
}

const Icon = ({
  children,
  name,
  className,
  style,
  size = 'md',
  color = 'primary',
  title,
  hoverColor,
  onClick,
  onBlur,
  disable = false,
  ...props
}: IIconProps) => {
  const classNames = cx(
    'icon',
    {
      [`icon-${name}`]: name,
      [`size-${size}`]: size,
      [`color-${color}`]: color,
      [`hover-${hoverColor}`]: hoverColor
    },
    className
  )

  if (!name) return null

  return (
    <i
      className={classNames}
      style={style}
      title={title}
      onClick={!disable ? onClick : () => {}}
      onBlur={!disable ? onBlur : () => {}}
      {...props}
    >
      {children}
    </i>
  )
}

export default Icon
