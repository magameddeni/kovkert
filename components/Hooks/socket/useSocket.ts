import { nanoid } from '@reduxjs/toolkit'
import { useAppSelector } from '@/redux/hook'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

import { API_URL } from '../../Http/axios'

export default function useSocket() {
  //   const [message, setMessage] = useState([]);
  const [response, setResponse] = useState<boolean>(false)
  const user = useAppSelector(({ beru }) => beru?.user.data)

  const localId = localStorage.getItem('sid')
  if (localId === undefined || localId === null) {
    const sid = nanoid()
    localStorage.setItem('sid', sid)
  }

  const [messageResponse, setMessageResponse] = useState<{
    error: boolean
    message: string
    formUrl: string
    id: string
  }>({
    error: true,
    message: '',
    formUrl: '',
    id: ''
  })

  const { current: socket } = useRef(
    // @ts-ignore
    io(API_URL, {
      query: {
        userSID: localStorage.getItem('sid'),
        id: user?.id
      }
    })
  )

  useEffect(() => {
    socket.on('custom_error', (data) => {
      setMessageResponse(data)
      if (data.message === 'Оплата онлайн') {
        setResponse(false)
      } else {
        setResponse(true)
      }
    })

    socket.on('success', (data) => {
      setResponse(true)
      setMessageResponse(data)
    })

    // socket.on("new_order:read", (data) => console.log(data));

    // socket.on("new_order:get", (messages) => {
    //   setMessage(messages);
    // });

    return () => {
      socket.off('custom_error')
      socket.off('new_order:read')
      socket.off('connect')
      socket.off('connection')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sendMessage = (message: any) => {
    socket.emit('new_order:create', message)
  }

  return { sendMessage, response, messageResponse, setResponse, socket }
}
