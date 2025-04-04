import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '@/redux/hook'
import { useRouter } from 'next/router'
import $api from '../Http/axios'
import useSocket from '../Hooks/socket/useSocket'
import { SOCKET_EVENTS } from './constants'
import { IChat, IMessage } from './types'

const MessengerContext = createContext(null)

interface IMessengerContextProviderProps extends PropsWithChildren {}

function MessengerContextProvider({ children }: IMessengerContextProviderProps) {
  const router = useRouter()
  const { socket } = useSocket()
  const [dialogs, setDialogs] = useState<any>([])
  const [images, setImages] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [sound, setSound] = useState(true)
  const [typingDialogs, setTypingDialogs] = useState<any>([])
  const [pending, setPending] = useState<any>([])
  const auth = useAppSelector(({ beru }) => beru.user)
  const [sendLoading, setSendLoading] = useState(false)

  useEffect(() => {
    $api
      .get('/api/chat/getconversations')
      .then(({ data }) => {
        data = data.map((item: any) => {
          item.counter = item.messages.filter((m: IMessage) => m.user !== auth?.data?.id && !m.read).length
          return item
        })

        setDialogs(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const addMessageToDialog = useCallback(
    (dialogId: any, message: any) => {
      const item: any = dialogs.find(({ _id }: { _id: any }) => _id === dialogId)

      if (item) {
        item?.messages.push(message)

        if (message.url === 'url') {
          item.lastMessage = 'изображение'
        } else {
          item.lastMessage = message.message
        }
      }

      setDialogs([...dialogs])
    },
    [dialogs]
  )

  const clearDialog = useCallback(
    (dialogId: string) => {
      const item = dialogs.find(({ _id }: { _id: any }) => _id === dialogId)

      if (item) {
        // @ts-ignore
        item.messages = []
        // @ts-ignore
        item.lastMessage = ''
      }

      setDialogs([...dialogs])
    },
    [dialogs]
  )

  useEffect(() => {
    if (socket) {
      socket.on(SOCKET_EVENTS.NEW_MESSAGE_ADDED, (message: IMessage) => {
        setPending((prev: any) => prev.filter((uid: any) => uid !== message.uid))
      })

      // Новое сообщение в диалоге
      socket.on(SOCKET_EVENTS.UPDATE_DIALOGS, (dialog: IChat) => {
        const item: any = dialogs.find(({ _id }: { _id: string }) => _id.toString() === dialog._id)

        if (item) {
          item.lastMessage = dialog.lastMessage
          item.messages = dialog.messages
          // item.messages = dialog.messages.filter(
          //   (message) => !message.deletedFor.includes(auth?.data?.id)
          // );

          if (dialog._id !== router.query.to) {
            item.counter = dialog.messages.filter((message) => message.user !== auth?.data?.id && !message.read).length
          }

          setDialogs((prev: IMessage[]) => [item, ...prev.filter((d) => d._id !== dialog._id)])
        } else {
          dialog.counter = dialog.messages.filter((m: IMessage) => m.user !== auth?.data?.id && !m.read).length

          setDialogs((prev: IMessage[]) => [dialog, ...prev])
        }

        setTypingDialogs((prev: any) => prev.filter((d: any) => d !== dialog._id))
        setSendLoading(false)
      })

      socket.on(SOCKET_EVENTS.READING_MESSAGES, (dialog: string) => {
        const item: any = dialogs.find(({ _id }: { _id: any }) => _id.toString() === dialog)

        if (item) {
          item.messages.forEach((message: any) => (message.read = true))
          setDialogs([...dialogs])
        }
      })

      // Очищение диалога
      socket.on(SOCKET_EVENTS.CLEAR_DIALOG, clearDialog)
    }

    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE)
      socket.off(SOCKET_EVENTS.CLEAR_DIALOG)
      socket.off(SOCKET_EVENTS.UPDATE_DIALOGS)
      socket.off(SOCKET_EVENTS.READING_MESSAGES)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, dialogs])

  useEffect(() => {
    new Audio('https://kovkert.ru/msg.mp3')

    if (sound) {
      socket.on(SOCKET_EVENTS.PLAY_AUDIO, () => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound])

  useEffect(() => {
    let timeout: any = null

    socket.on(SOCKET_EVENTS.TYPING_MESSAGE, (dialog) => {
      setTypingDialogs((prev: any) => [...prev, dialog])
      clearTimeout(timeout)

      timeout = setTimeout(() => {
        setTypingDialogs((prev: any) => prev.filter((d: any) => d !== dialog))
      }, 5000)
    })

    return () => {
      clearTimeout(timeout)
      socket.off(SOCKET_EVENTS.TYPING_MESSAGE)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const memoedValue: any = useMemo(
    () => ({
      sound,
      images,
      dialogs,
      loading,
      setSound,
      setImages,
      setDialogs,
      typingDialogs,
      setTypingDialogs,
      sendLoading,
      clearDialog,
      pending,
      setPending,
      setSendLoading,
      addMessageToDialog,
      socket
    }),
    [
      sound,
      images,
      dialogs,
      loading,
      setSound,
      setImages,
      setDialogs,
      typingDialogs,
      setTypingDialogs,
      sendLoading,
      clearDialog,
      pending,
      setPending,
      setSendLoading,
      addMessageToDialog,
      socket
    ]
  )

  return <MessengerContext.Provider value={memoedValue}>{children}</MessengerContext.Provider>
}

const useMessengerContext = () => useContext(MessengerContext)

export { MessengerContext, MessengerContextProvider, useMessengerContext }
