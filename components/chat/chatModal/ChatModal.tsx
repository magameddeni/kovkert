import React from 'react'
import { useAppSelector } from '@/redux/hook'
import { Messenger } from '../messenger'
import s from './style.module.scss'

const ChatModal = ({ conversationId }: { conversationId: string | null }) => {
  const userId = useAppSelector(({ beru }) => beru.user.data?._id)
  return (
    <div className={s.chat}>
      <Messenger
        user={{ id: userId }}
        conversationId={conversationId}
        deleteChatText='Очистить'
        disableParticipantCLick
      />
    </div>
  )
}
export default ChatModal
