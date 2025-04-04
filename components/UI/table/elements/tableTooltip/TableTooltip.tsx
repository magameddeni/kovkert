import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import { useOnClickOutside } from '@/hooks'
import { Icon } from 'components/UI'
import s from './style.module.scss'

export interface ITableTooltipProps extends PropsWithChildren {
  closeAfterClickOnContent?: boolean
  className?: string
  icon?: string
  iconSize?: string
  view?: 'dots' | 'question'
  hoverAction?: boolean
  size?: 'sm' | 'md'
}

const TableTooltip = ({
  children,
  closeAfterClickOnContent,
  className,
  icon = 'more',
  iconSize = 'lg',
  view = 'dots',
  hoverAction = false,
  size = 'md'
}: ITableTooltipProps) => {
  const [active, setActive] = useState<boolean>(false)
  const [contentTop, setContentTop] = useState<number>(0)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const tooltipClientRect = tooltipRef?.current?.getBoundingClientRect()
  const contentClientRect = contentRef?.current?.getBoundingClientRect()
  const isViewDots = view === 'dots'

  const classNames = cx(s.tooltip__content, {
    [s.active]: active,
    [s[`view-${view}`]]: view,
    [s[`size-${size}`]]: size
  })

  const closeContent = (e: any) => {
    const element = e.target

    if (contentRef?.current?.contains(element)) {
      setTimeout(() => setActive(false), 0)
      contentRef.current.removeEventListener('click', closeContent)
    }
  }

  const { onFocusElement } = useOnClickOutside(
    tooltipRef,
    () => {
      setActive(!active)
      if (contentRef.current && closeAfterClickOnContent) {
        contentRef.current.addEventListener('click', closeContent)
      }
    },
    () => setActive(false)
  )

  const setViewDotsContentTop = () => {
    if (tooltipRef?.current && contentRef?.current) {
      const tooltipClientRectCurrent = tooltipRef?.current?.getBoundingClientRect()
      const contentClientRectCurrent = contentRef?.current?.getBoundingClientRect()
      const contentTopShowBottomTooltip = tooltipClientRectCurrent?.top + tooltipClientRectCurrent?.height + 4

      if (contentTopShowBottomTooltip + contentClientRectCurrent?.height > window.innerHeight) {
        return setContentTop(tooltipClientRectCurrent?.top - contentClientRectCurrent?.height - 4)
      }

      setContentTop(contentTopShowBottomTooltip || 0)
    }
  }

  useEffect(() => {
    if (isViewDots && tooltipRef && contentRef) {
      setViewDotsContentTop()

      window.addEventListener('scroll', setViewDotsContentTop)
      return () => window.removeEventListener('scroll', setViewDotsContentTop)
    }
  }, [isViewDots, tooltipRef, contentRef])

  return (
    <div
      ref={tooltipRef}
      className={cx(s.tooltip, className, { [s[`view-${view}`]]: view })}
      onMouseEnter={() => (hoverAction ? setActive(true) : {})}
      onMouseLeave={() => (hoverAction ? setActive(false) : {})}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={s.tooltip__icon} onClick={onFocusElement}>
        <Icon name={icon} size={iconSize} />
      </div>
      {isViewDots ? (
        ReactDOM.createPortal(
          <div
            ref={contentRef}
            className={classNames}
            style={
              tooltipClientRect &&
              contentClientRect && {
                top: contentTop,
                left: tooltipClientRect?.left - contentClientRect?.width + tooltipClientRect?.width
              }
            }
          >
            {children}
          </div>,
          document.getElementById('__next') as any
        )
      ) : (
        <div ref={contentRef} className={classNames}>
          {active && children}
        </div>
      )}
    </div>
  )
}

export default TableTooltip
