import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import cx from 'classnames'
import { routes } from '@/constants'
import { useAppSelector } from '@/redux/hook'
import { Container, Icon } from '@/components/UI'
import { Search } from '@/components/search'
import emitter, { EVENTS } from '@/utils/emitter'
import CatalogMenu from '@/components/catalog/CatalogMenu'
import { BasketInfo, BecomeSellerButton, CatalogButton } from './ui'
import { ILayoutSearchParams } from '../models'
import s from './Header.module.scss'

const HEADER_SHADOW_CLASS = s['header--shadow']

interface IHeaderTopLink {
  name: string
  link: string
}

interface IHeaderProps {
  hasSearch?: boolean | undefined
  hasTopHeader?: boolean | undefined
  searchParams?: ILayoutSearchParams | undefined
}

const Header = ({ hasSearch = true, hasTopHeader = true, searchParams }: IHeaderProps) => {
  const [showCatalog, setShowCatalog] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const basket = useAppSelector(({ beru }) => beru.basket)
  const auth = useAppSelector(({ beru }) => beru.user)

  const headerTopLinks: Array<IHeaderTopLink> = [
    { name: 'Справочный раздел', link: routes.DOCS },
    { name: 'Как сделать заказ', link: `${routes.DOCS}?to=oformlenie-zakaza` },
    { name: 'Как вернуть товар', link: `${routes.DOCS}?to=vozvrat` },
    { name: 'Как оплатить', link: `${routes.DOCS}?to=oplata` },
    { name: 'Доставка', link: `${routes.DOCS}?to=dostavka` }
  ]

  const onClickCatalogHandler = () => setShowCatalog((prev) => !prev)

  const renderHeaderTopLink = ({ name, link }: IHeaderTopLink) => (
    <Link href={link}>
      <div className={s['header-top-link']}>{name}</div>
    </Link>
  )

  useEffect(() => {
    const scrollHandler = () => ref?.current?.classList.toggle(HEADER_SHADOW_CLASS, window.scrollY > 62)
    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [])

  useEffect(() => {
    setShowCatalog(false)
  }, [router.asPath])

  return (
    <header ref={ref} className={cx(s.header, { [s['header--full']]: showCatalog })}>
      {hasTopHeader && (
        <div className={s.header__top}>
          <Container>
            <div className={s['header__top--content']}>
              {renderHeaderTopLink(headerTopLinks[0])}
              <ul className={s['right-top-links']}>
                {headerTopLinks.slice(1).map((v: IHeaderTopLink) => (
                  <li key={v.link}>{renderHeaderTopLink(v)}</li>
                ))}
                <li>
                  <BecomeSellerButton />
                </li>
              </ul>
            </div>
          </Container>
        </div>
      )}
      <div className={s.header__middle}>
        <Container>
          <div className={s['header__middle--content']}>
            <div className={s.left}>
              <Link href={routes.MAIN}>
                <div className={s.logo}>
                  <img src='/logo.svg' alt='logo' />
                </div>
              </Link>
              <CatalogButton expand={showCatalog} onClick={onClickCatalogHandler} />
            </div>
            {hasSearch && <Search {...searchParams} />}
            <nav>
              <ul className={s.menu}>
                <li className={cx(s.menu__item, { [s.active]: router.pathname === routes.BASKET })}>
                  <BasketInfo count={basket?.quantity} />
                </li>
                <li className={cx(s.menu__item, { [s.active]: router.pathname === routes.FAVORITE })}>
                  <Link href={routes.FAVORITE}>
                    <div className={s.link}>
                      <Icon name='heart-light' size='xxl' />
                      Избранное
                    </div>
                  </Link>
                </li>
                <li className={cx(s.menu__item, { [s.active]: router.pathname === routes.ORDERS })}>
                  <Link href={routes.ORDERS}>
                    <div className={s.link}>
                      <Icon name='box-light' size='xxl' />
                      Заказы
                    </div>
                  </Link>
                </li>
                <li className={cx(s.menu__item, { [s.active]: router.pathname === routes.PROFILE })}>
                  {auth.isLoggedIn ? (
                    <Link href={routes.PROFILE}>
                      <div className={s.link}>
                        <Icon name='user-circle' size='xxl' />
                        Профиль
                      </div>
                    </Link>
                  ) : (
                    <div className={s.link} onClick={() => emitter.emit(EVENTS.SHOW_LOGIN_MODAL)}>
                      <Icon name='user-light' size='xxl' />
                      Войти
                    </div>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </Container>
      </div>

      {showCatalog && <CatalogMenu />}
    </header>
  )
}

export default Header
