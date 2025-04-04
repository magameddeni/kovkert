import React, { PropsWithChildren } from 'react'
import cx from 'classnames'
import Icon, { IIconProps } from '../icon/Icon'
import s from './style.module.scss'

interface IButtonProps extends PropsWithChildren {
  as?: 'button' | 'span' | 'div'
  className?: string
  style?: React.CSSProperties
  type?: 'button' | 'submit'
  onClick?: VoidFunction
  view?: 'primary' | 'secondary' | 'link'
  size?: 'xs' | 'sm' | 'lg'
  color?: 'black' | 'pink' | 'green' | 'white' | 'red' | 'extra-light-blue'
  disabled?: boolean
  fluid?: boolean | undefined
  iconLeft?: string
  iconRight?: string
  iconOptions?: IIconProps
}

const Button = ({
  children,
  as: ElementType = 'button',
  className,
  style,
  type = 'button',
  onClick,
  view = 'primary',
  size,
  color,
  disabled,
  fluid,
  iconLeft,
  iconRight,
  iconOptions,
  ...props
}: IButtonProps) => {
  const classNames = cx(
    s.button,
    s[`view-${view}`],
    s[`size-${size}`],
    {
      [s[`color-${color}`]]: color,
      [s.icon]: iconLeft || iconRight,
      [s.fluid]: fluid
    },
    className
  )

  return (
    <ElementType
      className={classNames}
      style={style}
      type={type}
      disabled={disabled}
      onClick={!disabled ? onClick : () => {}}
      {...props}
    >
      {iconLeft && <Icon name={iconLeft} color='white' {...iconOptions} />}
      {children}
      {iconRight && <Icon name={iconRight} color='white' {...iconOptions} />}
    </ElementType>
  )
}

export default Button
