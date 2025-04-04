import React, { PropsWithChildren, useRef, useState } from 'react'
import cx from 'classnames'
import { Icon } from '@/components/UI'
import s from './style.module.scss'

interface ITooltipProps extends PropsWithChildren {
  closeAfterClickOnContent?: boolean
  title?: string
  className?: string
}

const Tooltip = ({ children, closeAfterClickOnContent, title, className }: ITooltipProps) => {
  const [active, setActive] = useState<boolean>(false)
  const disclosureRef = useRef<HTMLDivElement | null>(null)
  const disclosureContentRef = useRef<HTMLDivElement | null>(null)

  const onClickOutsideResult = (e: any) => {
    const element = e.target

    if (disclosureRef.current && !disclosureRef.current.contains(element)) {
      e.stopPropagation()
      setActive(false)
      document.body.removeEventListener('click', onClickOutsideResult)
    }
  }

  const closeContent = (e: any) => {
    const element = e.target

    if (disclosureContentRef?.current?.contains(element)) {
      setTimeout(() => setActive(false), 0)
      disclosureContentRef.current.removeEventListener('click', closeContent)
    }
  }

  const handleSearchFocus = () => {
    setActive(!active)
    document.body.addEventListener('click', onClickOutsideResult)

    if (disclosureContentRef.current && closeAfterClickOnContent) {
      disclosureContentRef.current.addEventListener('click', closeContent)
    }
  }

  return (
    <div
      ref={disclosureRef}
      className={cx(s.tooltip, className)}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      {title ? (
        <>
          <div
            className={s.title}
            onMouseEnter={handleSearchFocus}
            onFocus={handleSearchFocus}
            onMouseLeave={handleSearchFocus}
          >
            {title}
          </div>
          <Icon name='arrow-bottom' className={s.tooltip__icon} />
        </>
      ) : (
        <Icon name='more' size='lg' onClick={handleSearchFocus} />
      )}
      <div ref={disclosureContentRef} className={cx(s.tooltip__menu, { [s.hover]: active })}>
        {active && children}
      </div>
    </div>
  )
}

export default Tooltip
