import React, { FC } from 'react'
import { FavoriteTabValues } from '@/components/favorite'
import cx from 'classnames'
import styles from './styles.module.scss'

interface Tab {
  id: FavoriteTabValues
  label: string
}

interface TabsProps {
  active: FavoriteTabValues
  className?: string
  onClick: (id: FavoriteTabValues) => void
  tabs: Tab[]
}

export const Tabs: FC<TabsProps> = ({ active, className, onClick, tabs }) => (
  <div className={cx(styles.tabs, className)} role='tablist'>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={cx(styles.tabs__item, { [styles['tabs__item--active']]: tab.id === active })}
        role='tab'
        onClick={() => onClick(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
)
