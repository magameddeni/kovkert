import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import ImageViewer from 'react-simple-image-viewer'
import { useAppSelector } from '@/redux/hook'
import { IMessage } from '../../types'
import { useMessengerContext } from '../../MessengerContext'
import ImageMessage from './ImageMessage'
import TextMessage from './TextMessage'
import s from './messages.module.scss'

interface IMessagesProps {
  messages: Array<IMessage>
  onReadingMessage: VoidFunction
}

const Messages: FC<IMessagesProps> = ({ onReadingMessage, messages = [] }) => {
  const [currentImage, setCurrentImage] = useState<number | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const { images, pending }: any = useMessengerContext()
  const scrollRef = useRef<HTMLDivElement | any>(null)
  const auth = useAppSelector(({ beru }) => beru.user)
  let index = useMemo(() => -1, [])

  const isSelfMessage = ({ user }: any) => user === auth?.data?.id

  const openImageViewer = (v: number) => {
    setCurrentImage(v)
    setIsViewerOpen(true)
  }

  const closeImageViewer = () => {
    setCurrentImage(null)
    setIsViewerOpen(false)
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToBottom()
      onReadingMessage()
    }
  }, [messages?.length])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToBottom()
    }
  }, [messages])

  useEffect(() => {
    document.body.classList.toggle('overFlow', isViewerOpen)
  }, [isViewerOpen])

  const groupMessagesByDate = (messagesArr: IMessage[]) => {
    const grouped: Map<string, IMessage[]> = new Map()

    messagesArr.forEach((message) => {
      const messageDate = new Date(message.createdAt)
      const today = new Date()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      let displayDate

      const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: messageDate.getFullYear() === today.getFullYear() ? undefined : 'numeric'
      }

      if (messageDate.toDateString() === today.toDateString()) {
        displayDate = 'Сегодня'
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        displayDate = 'Вчера'
      } else {
        displayDate = Intl.DateTimeFormat('ru-RU', options).format(messageDate)
      }

      if (!grouped.has(displayDate)) {
        grouped.set(displayDate, [])
      }
      grouped.get(displayDate)?.push(message)
    })

    return grouped
  }

  const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages])

  return (
    <Scrollbars autoHide ref={scrollRef} height='100%'>
      <div className={s.messages}>
        {Array.from(groupedMessages.entries()).map(([date, group]) => (
          <div key={`date-group-${date}`}>
            {date && <div className={s['date-header']}>{date}</div>}
            {group.map((message: IMessage) => {
              if (message.url) ++index

              return (
                <React.Fragment key={message.uid}>
                  {message.url ? (
                    <ImageMessage
                      self={isSelfMessage(message)}
                      onClick={openImageViewer}
                      message={message}
                      pending={message.pending && pending.includes(message.uid)}
                      index={index}
                    />
                  ) : (
                    <TextMessage
                      message={message}
                      self={isSelfMessage(message)}
                      pending={message.pending && pending.includes(message.uid)}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        ))}
        {isViewerOpen && <ImageViewer src={images} currentIndex={currentImage as number} onClose={closeImageViewer} />}
      </div>
    </Scrollbars>
  )
}

export default Messages
