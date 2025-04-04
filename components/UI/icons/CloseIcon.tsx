import React from 'react'
import cx from 'classnames'
import { ISize } from 'models'
import { Icon } from 'components/UI'
import s from './icons.module.scss'

interface ICloseIconProps {
  className?: string
  onClick?: VoidFunction | undefined
  color?: 'primary' | 'white-grey'
  iconSize?: ISize['size']
}

export const CloseIcon = ({ className, onClick, color = 'primary', iconSize = 'md' }: ICloseIconProps) => (
  <div
    className={cx(
      s['close-icon'],
      {
        [s[`color-${color}`]]: color
      },
      className
    )}
    onClick={onClick}
  >
    <Icon name='close' size={iconSize} color='middle-grey' />
  </div>
)
