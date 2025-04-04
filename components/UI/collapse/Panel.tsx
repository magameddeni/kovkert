import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { useWindowSize, useDebounce } from '@/hooks'
import { Icon, Text } from '@/components/UI'
import s from './style.module.scss'

interface IPanel extends PropsWithChildren {
  index: number
  label: string
  disabled?: boolean
  isArrowMoving?: boolean
  icon?: string
  defaultActiveTab?: number
}

export const Panel = ({ children, index, label, defaultActiveTab, disabled, isArrowMoving = true, icon }: IPanel) => {
  const [activeTab, setActiveTab] = useState<number | undefined>(defaultActiveTab)
  const [height, setHeight] = useState(0)
  const { width } = useWindowSize()
  const panelRef = useRef(null)
  const contentRef = useRef<null | HTMLDivElement>(null)
  const debouncedWidth = useDebounce(width, 500)
  const isActive = activeTab === index

  useEffect(() => {
    const currentHeight = contentRef?.current?.lastElementChild?.clientHeight
    setHeight(currentHeight ?? 0)
  }, [isActive, debouncedWidth])

  const panelClassList = cx(s.panel, {
    [s.active]: isActive,
    [s['arrow-moving']]: isArrowMoving
  })

  const inners = {
    height: `${isActive ? height : 0}px`
  }

  const activateTab = (tab: number) => setActiveTab(activeTab === tab ? -1 : tab)

  return (
    <div ref={panelRef} className={panelClassList}>
      <button className={s.panel__label} onClick={() => activateTab(index)} disabled={disabled}>
        <Text size='lg' overflow='ellipsis' family='secondary'>
          {label}
        </Text>
        <Icon
          className={s.arrow}
          color='gray'
          name={icon || (isArrowMoving ? 'arrow-top' : 'arrow-bottom')}
          size='md'
        />
      </button>

      <div ref={contentRef} className={s.panel__inner} style={inners}>
        <div className={s.panel__content}>{children}</div>
      </div>
    </div>
  )
}
