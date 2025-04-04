import React, { FC, memo, useMemo } from 'react'
import cn from 'classnames'
import { Icon } from '@/components/UI'
import styles from './icons.module.scss'

interface ArrowIconProps {
  arrow?: 'left' | 'right'
  onClick: VoidFunction
  disabled?: boolean
  className?: string | undefined
}

export const ArrowIcon: FC<ArrowIconProps> = memo(({ arrow = 'left', onClick, disabled, className }) => {
  const isLeft = useMemo(() => arrow === 'left', [arrow])

  return (
    <div
      className={cn(
        styles['arrow-icon'],
        styles[`${isLeft ? 'prev' : 'next'}-btn`],
        {
          [styles.disabled]: disabled
        },
        className
      )}
      onClick={onClick}
    >
      <Icon name={`arrow-${isLeft ? 'left' : 'right'}`} size='lg' />
    </div>
  )
})
