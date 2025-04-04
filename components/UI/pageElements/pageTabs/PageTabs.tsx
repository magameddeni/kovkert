import React, { PropsWithChildren } from 'react'
import Tab from './Tab'
import s from './style.module.scss'

interface IPageTabsProps extends PropsWithChildren {}

const PageTabs = ({ children }: IPageTabsProps) => <div className={s['page-tabs']}>{children}</div>

export default Object.assign(PageTabs, {
  Tab
})
