import React, { useMemo } from 'react'
import Link from 'next/link'
import { useWindowSize } from '@/hooks'
import { routes } from '@/constants'
import { Icon } from '@/components/UI'
import cx from 'classnames'
import styles from './basketInfo.module.scss'

type Props = {
  count?: number
  title?: boolean
}

const BasketInfo = ({ count, title = true }: Props) => {
  const { isSmall } = useWindowSize()

  const value = useMemo(() => {
    if (count) return count > 99 ? `99+` : count
  }, [count])

  return (
    <Link href={routes.BASKET}>
      <div className={cx(styles.link, { [styles['with-title']]: title })}>
        <Icon name='cart' size='xxl' />
        {!isSmall && title && <span>Корзина</span>}
        {Boolean(count) && <div className={styles.badge}>{value}</div>}
      </div>
    </Link>
  )
}

export default BasketInfo
