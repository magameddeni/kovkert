import React from 'react'
import { MessengerContextProvider } from '@/components/chat/MessengerContext'
import Chat from '@/components/chat'
import s from './profile-chat.module.scss'

const ProfileChat = () => (
  <MessengerContextProvider>
    <Chat className={s['profile-chat']} arrowBack={false} />
  </MessengerContextProvider>
)

export default ProfileChat
