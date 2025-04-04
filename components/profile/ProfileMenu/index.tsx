import React from 'react'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { routes } from '@/constants'
import { menuItems } from '@/components/profile/ProfileMenu/data'
import { useWindowSize } from '@/hooks'
import { ProfileTabValues } from '@/components/profile/types'
import { useAppSelector } from '@/redux/hook'
import { AppState } from '@/redux/store'
import { useLogoutUserMutation } from '@/redux/auth/authApi'
import Icon from '../../UI/icon/Icon'
import s from './styles.module.scss'

interface ProfileMenuProps {
  active: ProfileTabValues
  onClick: (id: ProfileTabValues) => void
}

const ProfileMenu = ({ active, onClick }: ProfileMenuProps) => {
  const { isLarge } = useWindowSize()
  const { push } = useRouter()

  const auth = useAppSelector(({ beru }: AppState) => beru.user)
  const [logout] = useLogoutUserMutation()

  const handleLogout = async () => {
    try {
      await push(routes.MAIN)
      await logout().unwrap()
    } catch {
      /* empty */
    }
  }

  const handleClick = ({ id, link }: { id: ProfileTabValues; link: string }) => {
    if (!isLarge) {
      void push(link)
    } else {
      onClick(id)
    }
  }

  const renderItems = () => {
    let items = menuItems

    if (!isLarge) {
      items = items.filter((item) => item.id !== ProfileTabValues.INFO)

      items.unshift({
        id: ProfileTabValues.INFO,
        link: `${routes.PROFILE}/info`,
        title: `${auth?.data?.name ?? 'Гость'} ${auth?.data?.lastName ?? ''}`,
        icon: 'user-light'
      })
      items.push({ id: ProfileTabValues.FAVORITE, link: routes.FAVORITE, title: 'Избранное', icon: 'heart-light' })
    }

    return items.map(({ id, icon, link, title }) => (
      <li key={id}>
        <button className={s.menu__button} onClick={() => handleClick({ id, link })}>
          <span
            className={cx(s.menu__button_content, {
              [s['menu__button_content-active']]: active === id && isLarge
            })}
          >
            <Icon name={icon} size='md' color={active === id && isLarge ? 'blue' : 'primary'} />
            {title}
          </span>
          {!isLarge && <Icon name='arrow-right' size='sm' />}
        </button>
      </li>
    ))
  }

  return (
    <ul className={s.menu}>
      {renderItems()}
      {!isLarge && (
        <button className={s.menu__logout_btn} onClick={handleLogout}>
          <Icon name='exit' color='red' size='md' />
          Выйти
        </button>
      )}
    </ul>
  )
}

export default ProfileMenu
