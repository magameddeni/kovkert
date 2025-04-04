import React from 'react'
import Link from 'next/link'
import { useAppSelector } from '@/redux/hook'
import { routes } from '@/constants'
import { Icon } from '@/components/UI'
import { BasketInfo } from '@/components/layout/header/ui'
import emitter, { EVENTS } from '@/utils/emitter'
import styles from '../../Mobileheader.module.scss'

const UserControlMobileButtons = () => {
  const basket = useAppSelector(({ beru }) => beru.basket)
  const auth = useAppSelector(({ beru }) => beru.user)

  return (
    <nav aria-label='Пользовательская навигация' className={styles.nav}>
      <ul className={styles.nav__list}>
        <li>
          <BasketInfo count={basket.quantity} title={false} />
        </li>
        <li>
          {auth.isLoggedIn ? (
            <Link href={routes.PROFILE} className={styles.nav__link}>
              <Icon name='user-circle' size='xxl' />
            </Link>
          ) : (
            <div className={styles.nav__link} onClick={() => emitter.emit(EVENTS.SHOW_LOGIN_MODAL)}>
              <Icon name='user-light' size='xxl' />
            </div>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default UserControlMobileButtons
