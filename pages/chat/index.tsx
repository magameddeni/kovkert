import React, { useEffect } from 'react'
import { meta } from '@/constants'
import { useAppSelector } from '@/redux/hook'
import { AppState } from '@/redux/store'
import { MessengerContextProvider } from '@/components/chat/MessengerContext'
import Layout from '@/components/layout/Main'
import NotAuthorized from '@/components/auth/NotAuthorized'
import Chat from '@/components/chat'
import s from './chat-page.module.scss'

const ChatPage = () => {
  const { isLoggedIn } = useAppSelector(({ beru }: AppState) => beru.user)

  useEffect((): any => {
    document.body.style.overflow = 'hidden'
    return () => (document.body.style.overflow = 'visible')
  }, [])

  if (!isLoggedIn) return <NotAuthorized accessToText='чату' />

  return (
    <Layout meta={{ ...meta.CHAT }} className={s['chat-page']}>
      <MessengerContextProvider>
        <Chat className={s['chat-page__content']} />
      </MessengerContextProvider>
    </Layout>
  )
}

export default ChatPage
