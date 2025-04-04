import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import cx from 'classnames'
import { routes } from '@/constants'
import { Container, Icon } from '@/components/UI'
import { ILayoutSearchParams } from '@/components/layout/models'
import { SearchMobile } from '@/components/search'
import CatalogMenuMobile from '@/components/catalog/CatalogMenuMobile'
import { BecomeSellerButton, UserControlMobileButtons } from './ui'
import styles from './Mobileheader.module.scss'

interface IMobileHeaderProps {
  hasSearch?: boolean | undefined
  hasTopHeader?: boolean | undefined
  buttonBack?: boolean | undefined
  searchParams?: ILayoutSearchParams | undefined
}

const MobileHeader = ({
  hasSearch = true,
  hasTopHeader = true,
  buttonBack = false,
  searchParams
}: IMobileHeaderProps) => {
  const [showCatalog, setShowCatalog] = useState(false)
  const router = useRouter()

  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = () => {
    if (window.scrollY > 10 && window.innerHeight + window.scrollY <= document.body.offsetHeight) {
      if (window.scrollY > lastScrollY) setIsVisible(false)
      else setIsVisible(true)
      setLastScrollY(window.scrollY)
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', showCatalog)
  }, [showCatalog])

  const handleClose = useCallback(() => {
    setShowCatalog(false)
  }, [])

  return (
    <header>
      {hasTopHeader && (
        <div className={styles['header__top-wrapper']}>
          <Container className={styles.header__top}>
            <Link href={routes.DOCS}>
              <div>Полезные ссылки</div>
            </Link>
            <BecomeSellerButton />
          </Container>
        </div>
      )}
      <Container
        className={cx(styles.header__middle, {
          [styles['header__middle-border']]: !isVisible && window.scrollY > 50
        })}
      >
        {buttonBack ? (
          <Icon name='arrow-left2' onClick={() => router.back()} />
        ) : (
          <button className={styles.header__burger} onClick={() => setShowCatalog(true)} />
        )}
        <Link href={routes.MAIN}>
          <div className={styles.logo}>
            <img src='/logo.svg' alt='logo' />
          </div>
        </Link>
        <UserControlMobileButtons />
      </Container>
      {hasSearch && (
        <Container
          className={cx(styles.header__bottom, {
            [styles['header__bottom-fixed']]: isVisible,
            [styles['header__bottom-border']]: isVisible && window.scrollY > 50
          })}
        >
          <SearchMobile {...searchParams} />
        </Container>
      )}
      {showCatalog && <CatalogMenuMobile onClose={handleClose} />}
    </header>
  )
}

export default MobileHeader
