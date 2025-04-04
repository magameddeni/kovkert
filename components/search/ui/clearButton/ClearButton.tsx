import React from 'react'
import cx from 'classnames'
import { Icon } from '@/components/UI'
import s from './clear-button.module.scss'

interface IClearButton {
  onClick: ((e: React.ChangeEvent<HTMLElement>) => Promise<void> | void) | VoidFunction
  marginRight?: boolean
}

const ClearButton = ({ onClick, marginRight = false }: IClearButton) => (
  <Icon
    className={cx(s['clear-button'], { [s['margin-right']]: marginRight })}
    name='close'
    color='gray'
    size='md'
    onClick={onClick}
  />
)

export default ClearButton
