'use client'

import React, { useCallback, useEffect } from 'react'
import { Router } from 'next/router'
import ym, { YMInitializer } from 'react-yandex-metrika'

const YM_COUNTER_ID = 97806971

type Props = {
  enabled: boolean
}

const YandexMetrika: React.FC<Props> = ({ enabled }) => {
  const hit = useCallback(
    (url: string) => {
      if (enabled) {
        ym('hit', url)
      } else {
        console.error(`%c[YandexMetrika](HIT)`, `color: orange`, url)
      }
    },
    [enabled]
  )

  useEffect(() => {
    hit(window.location.pathname + window.location.search)
    Router.events.on('routeChangeComplete', (url: string) => hit(url))
  }, [hit])

  if (!enabled) return null

  return (
    <YMInitializer
      accounts={[YM_COUNTER_ID]}
      options={{
        defer: true,
        webvisor: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true
      }}
      version='2'
    />
  )
}

export default YandexMetrika
