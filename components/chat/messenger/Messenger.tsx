import React, { FC, useEffect, useState } from 'react'
// @ts-ignore
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import { checkFileSize } from '@/helpers'
import { routes, SITE_URL } from '@/constants'
import { Icon, Text, Tooltip } from '@/components/UI'
import { useWindowSize, useQueryParams } from '@/hooks'
import { BottomMessengerPanel } from './bottomMessengerPanel'
import { useMessengerContext } from '../MessengerContext'
import { SOCKET_EVENTS } from '../constants'
import { ChooseChat } from './chooseChat'
import { Messages } from './messages'
import { IChat, IMessage } from '../types'
import $api from '../../Http/axios'
import s from './messenger.module.scss'

interface IMessengerProps {
  loading?: boolean
  deleteChatText?: 'Удалить' | 'Очистить'
  disableParticipantCLick?: boolean
  user: any
  conversationId: string | any
}

const Messenger: FC<IMessengerProps> = ({
  loading,
  user,
  conversationId,
  disableParticipantCLick = false,
  deleteChatText = 'Удалить'
}) => {
  const [activeDialog, setActiveDialog] = useState<IChat | null>(null)
  const { addMessageToDialog, setImages, setPending, socket, dialogs }: any = useMessengerContext()
  const { isSmall } = useWindowSize()
  const { deleteQuery } = useQueryParams()
  const router = useRouter()

  useEffect(() => {
    setActiveDialog(dialogs.find((dialog: any) => dialog._id === conversationId))
  }, [conversationId, dialogs])

  useEffect(() => setPending([]), [conversationId])

  const onBack = () => {
    if (router.query.shop) router.back()
    else deleteQuery('activeChat')
  }

  const handleSendMessage = (message: any, file: File | null = null) => {
    if (!checkFileSize(file, 2)) {
      const newMessage = {
        message,
        uid: uuid(),
        conversation: activeDialog?._id,
        user: user.id,
        sender: user.id,
        pending: true,
        url: null
      }
      // @ts-ignore
      if (file) newMessage.url = 'url'

      setPending((prev: any) => [...prev, newMessage.uid])

      if (!file) {
        socket.emit(SOCKET_EVENTS.NEW_MESSAGE, newMessage)
      } else {
        const formData = new FormData()
        formData.append('file', file)

        $api
          .post('/api/chat/uploadfile', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            params: { ...newMessage }
          })
          .catch((err) => {
            console.error(err)
          })
      }

      addMessageToDialog(activeDialog?._id, {
        ...newMessage,
        self: true
      })
    }
  }

  const handleReadingMessage = () => {
    socket.emit(SOCKET_EVENTS.READING_MESSAGES, {
      conversation: activeDialog?._id,
      user: user.id
    })
  }

  const handleInput = () => {
    socket.emit(SOCKET_EVENTS.TYPING_MESSAGE, {
      conversation: activeDialog?._id,
      user: user.id
    })
  }

  const handleItemClick = () => {
    socket.emit(SOCKET_EVENTS.CLEAR_DIALOG, {
      conversation: activeDialog?._id,
      user: user.id
    })
  }

  useEffect(() => {
    if (activeDialog && Object.keys(activeDialog).length) {
      setImages(
        activeDialog.messages
          .map((message: IMessage) => {
            if (message.url) return `${SITE_URL}${message.url}`
            return null
          })
          .filter(Boolean)
      )
    }
  }, [activeDialog])

  if (loading || !activeDialog) return <ChooseChat />

  return (
    <div className={s.messenger}>
      <div className={s.messenger__header}>
        {isSmall && <Icon name='arrow-left2' className={s['button-back']} onClick={onBack} />}
        <div
          onClick={() => disableParticipantCLick ?? router.push(`${routes.SHOP}/${activeDialog.companion.slug}`)}
          className={s.messenger__header_participant}
        >
          {Boolean(activeDialog.companion?.image) && (
            <img src={activeDialog.companion?.image} className={s.avatar} alt='logo' />
          )}

          <Text cursor='pointer' as='div' className={s.title}>
            {activeDialog?.companion?.name}
          </Text>
        </div>
        <Tooltip className={s.tooltip} closeAfterClickOnContent>
          <div className={s.tooltip__content} onClick={handleItemClick}>
            <Icon name='remove' color='red' />
            <Text className={s.text} color='red'>
              {deleteChatText}
            </Text>
          </div>
        </Tooltip>
      </div>
      <Messages onReadingMessage={handleReadingMessage} messages={activeDialog.messages} />
      <BottomMessengerPanel onInput={handleInput} onSendMessage={handleSendMessage} />
    </div>
  )
}

export default Messenger
