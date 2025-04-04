import React, { FC, useEffect } from 'react'
import cx from 'classnames'
import { Text } from 'components/UI'
import { IChat, IMessage } from '../types'
import { Typing } from './typing'
import { ChatsSkeleton } from './chatsSkeleton'
import s from './chats.module.scss'

interface IChatsProps {
  activeChat: IChat | null
  chats: IChat[]
  loading?: boolean
  onSelectDialog: (arg: string) => void
  typingDialogs: string[]
}

const Chats: FC<IChatsProps> = ({ activeChat = null, chats, loading, onSelectDialog, typingDialogs }) => {
  const getCorrectTime = (message: IMessage | undefined) => {
    const messageDate = new Date(message?.updatedAt as Date)
    const dateNow = new Date()

    if (!message?.updatedAt) return ''

    if (
      messageDate.getDate() + messageDate.getMonth() + messageDate.getFullYear() !==
      dateNow.getDate() + dateNow.getMonth() + dateNow.getFullYear()
    ) {
      return `${messageDate.getDate()}.${
        messageDate.getMonth() < 9 ? `0${messageDate.getMonth() + 1}` : messageDate.getMonth() + 1
      }`
    }

    return `${messageDate.getHours()}:${
      messageDate.getMinutes() < 10 ? `0${messageDate.getMinutes()}` : messageDate.getMinutes()
    }`
  }

  useEffect(() => {
    if (activeChat?._id) {
      const item = chats.find(({ _id }) => _id === activeChat._id)
      if (item) item.counter = 0
    }
  }, [activeChat])

  if (loading) return <ChatsSkeleton />
  if (!chats?.length)
    return (
      <Text className={s['empty-chats']} color='gray' family='secondary'>
        Чатов не найдено
      </Text>
    )

  return (
    <div className={s.chats}>
      {chats?.map((v: IChat) => (
        <div
          key={v._id}
          className={cx(s.chat, { [s.active]: activeChat?._id === v._id })}
          onClick={() => onSelectDialog(v._id)}
        >
          {!!v.companion?.image && (
            <div className={s.chat__logo}>
              <img src={v.companion?.image} alt='logo' />
            </div>
          )}
          <div className={s.chat__info}>
            <div className={s.title}>
              <Text family='secondary'>{v?.companion?.name}</Text>
              {v.type === 'appeal' && <Text>Менеджер</Text>}
            </div>
            <div className={s['last-message']}>
              {!typingDialogs.includes(v._id.toString()) ? (
                <Text as='p' overflow='ellipsis'>
                  {v.lastMessage}
                </Text>
              ) : (
                <Typing />
              )}
            </div>
          </div>
          <div className={s.chat__date}>
            <Text color='gray' weight='light'>
              {getCorrectTime(v.messages?.[v.messages?.length - 1])}
            </Text>
            {Boolean(v?.counter) && <div className={s.label} />}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Chats
