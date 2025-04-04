import React, { PropsWithChildren } from 'react'
import Icon from '../icon/Icon'
import s from './style.module.scss'

interface ISuffixProps extends PropsWithChildren {
  suffix?: string | undefined
  onClick?: VoidFunction
}

export const Suffix = ({ children, suffix, onClick }: ISuffixProps) => (
  <span className={s.suffix} onClick={onClick}>
    {children}
    {suffix && <Icon name={suffix} />}
  </span>
)
