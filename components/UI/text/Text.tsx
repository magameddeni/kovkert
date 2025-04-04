import React, { ForwardedRef, PropsWithChildren } from 'react'
import cx from 'classnames'
import { ISize } from '@/models'
import s from './style.module.scss'

interface ITextProps extends ISize, PropsWithChildren {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'li' | 'b' | 'i' | 'small' | 'strong' | 'a'
  className?: string | undefined
  style?: React.CSSProperties
  color?:
    | string
    | 'primary'
    | 'usual-gray'
    | 'gray'
    | 'dark-gray'
    | 'white'
    | 'blue'
    | 'orange'
    | 'red'
    | 'peach'
    | undefined
  requiredColor?: string
  align?: 'start' | 'end' | 'center' | 'justify'
  weight?: 'bold' | 'semibold' | 'medium' | 'regular' | 'light'
  overflow?: 'fade' | 'ellipsis'
  transform?: 'lowercase' | 'uppercase' | 'capitalize'
  decoration?: 'underline' | 'line-through'
  whiteSpace?: 'pre-line' | 'nowrap'
  family?: 'primary' | 'secondary'
  cursor?: 'pointer'
  required?: boolean | undefined
  disable?: boolean
  onClick?: VoidFunction
}

const Text = React.forwardRef(
  (
    {
      children,
      as: ElementType = 'span',
      className,
      style,
      size,
      color = 'primary',
      requiredColor,
      align,
      weight,
      overflow,
      transform,
      decoration,
      whiteSpace,
      family,
      cursor,
      required,
      disable,
      onClick,
      ...props
    }: ITextProps,
    ref: ForwardedRef<any>
  ) => {
    const classList = cx(
      s.text,
      {
        [s[`text-${size}`]]: size,
        [s[`color-${color}`]]: color,
        [s[`required-color-${requiredColor}`]]: requiredColor,
        [s[`text-${align}`]]: align,
        [s[`text-${weight}`]]: weight,
        [s[`text-overflow-${overflow}`]]: overflow,
        [s[`text-transform-${transform}`]]: transform,
        [s[`text-decoration-${decoration}`]]: decoration,
        [s[`white-space-${whiteSpace}`]]: whiteSpace,
        [s[`font-family-${family}`]]: family,
        [s[`cursor-${cursor}`]]: cursor,
        [s.required]: required,
        [s.disable]: disable
      },
      className
    )

    return (
      <ElementType ref={ref} className={classList} style={style} onClick={onClick} {...props}>
        {children}
      </ElementType>
    )
  }
)

export default Text
