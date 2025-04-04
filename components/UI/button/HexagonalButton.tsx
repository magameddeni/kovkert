import React, { FC, PropsWithChildren, useMemo, useState } from 'react'
import cx from 'classnames'
import { Button } from '@/components/UI'
import s from './style.module.scss'

interface HexagonalButtonProps extends PropsWithChildren {
  className?: string
  onClick?: VoidFunction
  active?: boolean
  small?: boolean
  fluid?: boolean
}

export const HexagonalButton: FC<HexagonalButtonProps> = ({
  children,
  className,
  onClick,
  active = true,
  small = false,
  fluid
}) => {
  const [onHover, setOnHover] = useState(false)

  const currentImg = useMemo(() => {
    if (!small) {
      if (!active) {
        return '/hexagonal-blue-button.svg'
      }

      if (onHover) return '/hexagonal-button-hover.svg'
      return '/hexagonal-button.svg'
    }

    if (!active) {
      return '/hexagonal-blue-button-mobile.svg'
    }

    if (onHover) return '/hexagonal-button-mobile-hover.svg'
    return '/hexagonal-button-mobile.svg'
  }, [onHover, small, active])

  const classList = cx(
    s['hexagonal-button'],
    {
      [s.active]: active,
      [s.fluid]: fluid
    },
    className
  )

  return (
    <div
      className={classList}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
      onClick={active ? onClick : () => {}}
    >
      <img src={currentImg} className={s['hexagonal-button__img']} alt='' />
      <Button fluid>{children}</Button>
    </div>
  )
}
