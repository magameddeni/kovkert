import React, { useEffect } from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })
export const RouterProgressProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleStart = () => NProgress.start()
    const handleComplete = () => NProgress.done()

    Router.events.on('routeChangeStart', handleStart)
    Router.events.on('routeChangeComplete', handleComplete)
    Router.events.on('routeChangeError', handleComplete)

    return () => {
      Router.events.off('routeChangeStart', handleStart)
      Router.events.off('routeChangeComplete', handleComplete)
      Router.events.off('routeChangeError', handleComplete)
    }
  }, [])

  return <>{children}</>
}
