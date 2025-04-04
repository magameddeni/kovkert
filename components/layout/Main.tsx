import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import cx from 'classnames'
import { SITE_URL } from '@/constants'
import { isPWA } from '@/utils/isPWA'
import { useWindowSize } from '@/hooks'
import ModalCosntructor from '@/components/Modals/ModalConstructor'
import LogIn from '@/components/Modals/LogInModal/LogIn'
import emitter, { EVENTS } from '@/utils/emitter'
import usePushNotification from '@/hooks/usePushNotification'
import { useAppSelector } from '@/redux/hook'
import Pwa from '../Pwa'
import { ILayoutSearchParams } from './models'
import { enhastedKeywords, isFreeLayout, isMobileHeader } from './utils'
import MobileHeader from './header/MobileHeader'
import Header from './header/Header'
import Footer from './footer/Footer'
import s from './layout.module.scss'

const ConditionalNotificationComponent = () => {
  usePushNotification()
  return null
}

export interface ILayoutMeta {
  title?: string
  description?: string
  keywords?: string
  manifest?: string
}

interface ILayoutProps extends PropsWithChildren {
  meta: ILayoutMeta
  offsetBottom?: 100 | 0 | undefined
  className?: string
  hasSearch?: boolean | undefined
  hasTopHeader?: boolean | undefined
  hasHeader?: boolean | undefined
  buttonBack?: boolean | undefined
  searchParams?: ILayoutSearchParams | undefined
}

const Layout = ({
  children,
  meta,
  offsetBottom,
  className,
  hasHeader = true,
  hasSearch = true,
  hasTopHeader = true,
  buttonBack = false,
  searchParams
}: ILayoutProps) => {
  const [showLogIn, setShowLogIn] = useState(false)
  const { deviceWidth, isSmall } = useWindowSize()
  const { pathname, asPath } = useRouter()
  const user = useAppSelector(({ beru }) => beru.user)

  useEffect(() => {
    emitter.on(EVENTS.SHOW_LOGIN_MODAL, () => setShowLogIn(true))
    return () => emitter.off(EVENTS.SHOW_LOGIN_MODAL)
  }, [])

  return (
    <div
      className={cx(
        s.app,
        {
          [s[`bottom-${offsetBottom}`]]: offsetBottom,
          [s['without-bottom']]: offsetBottom === 0,
          [s['remove-user-select']]: isPWA()
        },
        className
      )}
    >
      <Head>
        <title>{meta?.title ?? 'KOVKERT'}</title>
        <meta name='description' content={meta?.description ?? ''} />
        <meta name='keywords' content={enhastedKeywords(meta?.keywords ?? '')} />
        <meta property='og:title' content={meta?.title ?? 'KOVKERT'} />
        <meta property='og:locale' content='ru_RU' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={`${SITE_URL}${asPath}` ?? 'https://www.kovkert.ru/'} />
        <meta name='apple-itunes-app' content='app-id=6668526431' />
        <meta property='og:site_name' content='kovkert.ru' />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' />
        <meta name='mailru-domain' content='2kK3RztwflomXooH' />
        <meta name='yandex-verification' content='102344b3c59d2681' />
        <meta name='color-scheme' content='only light' />
        <link rel='manifest' href={meta?.manifest ?? ''} />
        <link rel='icon' href='/favicon.png' />
        <link rel='apple-touch-icon' href='/touch-icon-ipad-retina.png' />
        <link rel='apple-touch-icon' sizes='76x76' href='/favicon-76x76.png' />
        <link rel='apple-touch-icon' sizes='120x120' href='/favicon-120x120.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/favicon-152x152.png' />
        <link rel='icon' type='image/png' sizes='76x76' href='/favicon-76x76.png' />
        <link rel='icon' type='image/png' sizes='120x120' href='/favicon-120x120.png' />
        <link rel='icon' type='image/png' sizes='152x152' href='/favicon-152x152.png' />
      </Head>
      {user?.data && <ConditionalNotificationComponent />}
      {hasHeader &&
        (isFreeLayout(pathname) ? null : !isSmall && !isMobileHeader(pathname, deviceWidth) ? (
          <Header hasSearch={hasSearch} searchParams={searchParams} hasTopHeader={hasTopHeader} />
        ) : (
          <MobileHeader
            hasSearch={hasSearch}
            searchParams={searchParams}
            hasTopHeader={hasTopHeader}
            buttonBack={buttonBack}
          />
        ))}
      <main className={s.main}>{children}</main>
      {!isFreeLayout(pathname) ? <Footer /> : null}

      <ModalCosntructor rounded show={showLogIn} onClose={() => setShowLogIn(false)}>
        <LogIn onClose={() => setShowLogIn(false)} />
      </ModalCosntructor>
      <Pwa />
    </div>
  )
}

export default Layout
