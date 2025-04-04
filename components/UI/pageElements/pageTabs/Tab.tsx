import React from 'react'
import cx from 'classnames'
import { Text } from 'components/UI'
import s from './style.module.scss'

interface ITabProps<T> {
  tabKey: T
  title: string
  active: T
  onChange: (tabKey: T) => void
  label?: string | number
  labelColor?: 'primary' | 'red' | 'blue' | undefined
  disabled?: boolean
}

const Tab = <T,>({
  tabKey,
  title,
  active,
  onChange,
  label,
  labelColor = 'primary',
  disabled = false
}: ITabProps<T>) => (
  <div
    className={cx(s.tab, {
      [s.active]: tabKey === active,
      [s.disabled]: disabled
    })}
    onClick={() => onChange(tabKey)}
  >
    <Text size='sm' className={s.tab__title}>
      {title}
    </Text>
    {label && (
      <Text size='xxs' className={cx(s.tab__label, s[`color-${labelColor}`])}>
        {label}
      </Text>
    )}
  </div>
)

export default Tab
